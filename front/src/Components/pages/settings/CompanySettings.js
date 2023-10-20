import React, { useState, useEffect } from "react";
import "./Settings.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import UserService from "../../../Services/UserService";
import axios from "axios";
import { FloatingLabel } from "react-bootstrap";
import { MDBRadio } from "mdb-react-ui-kit";
import { BsPencil } from "react-icons/bs";
function CompanySettings() {
  const [validated, setValidated] = useState(false);
  const refresh = () => window.location.reload(true);
  let [info, setInfo] = useState({});
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  function getCompany() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .get("http://localhost:3001/users/getCompany", headers)
      .then((response) => {
        console.log(response);
        // setInfo(response.data);
        setInfo(response.data);
      });
  }

  async function applySettings() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };
    console.log(headers);
    const response = await UserService.applyCompanySettings(headers, info);
    console.log(response);
  }

  useEffect(() => {
    getCompany();
  }, []);

  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const newWordCount = text.trim().split(/\s+/).length;
    setWordCount(newWordCount);
  }, [text]);

  const handleChange = (event) => {
    const { value } = event.target;
    setText(value);
  };

  console.log("info", info);

  const [state, setState] = useState({
    file: null,
    base64URL: "",
  });

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        console.log(baseURL);
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };

  const handleFileInputChange = (e) => {
    console.log(e.target.files[0]);
    let { file } = state;

    file = e.target.files[0];

    getBase64(file)
      .then((result) => {
        file["base64"] = result;
        console.log("File Is", file);
        setState({
          base64URL: result,
          file,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    setState({
      file: e.target.files[0],
    });
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  };
  function applyNewPic() {
    const token = localStorage.getItem("token");

    axios
      .request({
        method: "POST",
        url: "http://127.0.0.1:3001/users/applyNewPic",
        headers: {
          token: token,
        },
        data: {
          picture: state.base64URL,
        },
      })
      .then((response) => {
        console.log("response ta3 Taswira", response);
      });
  }
  console.log(info);
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const handleEditClick = () => {
    setIsInputEnabled(!isInputEnabled); // Toggle input enable/disable
  };
  return (
    <div className="profileMain" id="profileUpdate">
      <div className="card" id="settingCard">
        <h4 style={{ fontSize: "150%" }}>
          Modifier votre profile de l'entreprise :{" "}
        </h4>
        <div className="puts">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Nom commercial </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="text"
                    placeholder="exemple:CAPIT"
                    value={info.entrepriseName}
                    onChange={(e) =>
                      setInfo({ ...info, entrepriseName: e.target.value })
                    }
                    disabled={!isInputEnabled}
                  />
                  <InputGroup.Text
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                  >
                    <BsPencil />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom02">
                <Form.Label>Votre Poste dans l'entreprise</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="text"
                    placeholder="exemple:CEO"
                    value={info.postEntreprise}
                    onChange={(e) =>
                      setInfo({ ...info, postEntreprise: e.target.value })
                    }
                    disabled={!isInputEnabled}
                  />
                  <InputGroup.Text
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                  >
                    <BsPencil />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Adresse d'entreprise </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="exemple:Lac"
                    required
                    value={info.adresseLocal}
                    onChange={(e) =>
                      setInfo({ ...info, adresseLocal: e.target.value })
                    }
                    disabled={!isInputEnabled}
                  />
                  <InputGroup.Text
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                  >
                    <BsPencil />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Statut d'entreprise</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="text"
                    placeholder="exemple :Siège social"
                    value={info.entrepriseStatus}
                    onChange={(e) =>
                      setInfo({ ...info, entrepriseStatus: e.target.value })
                    }
                    disabled={!isInputEnabled}
                  />

                  <InputGroup.Text
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                  >
                    <BsPencil />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Row>
            <div style={{ display: "flex" }}>
              <Row className="mb-3" style={{ flex: 1, marginLeft: "3%" }}>
                <Form.Label>Nombre d'employés :</Form.Label>
                <Col>
                  <Form.Check
                    type="radio"
                    id="petite-entreprise"
                    label="<=20"
                    name="entreprise-size"
                    onChange={() =>
                      setInfo({ ...info, numEmployees: "petite" })
                    }
                    checked={info.numEmployees === "petite"}
                  />
                  <Form.Check
                    type="radio"
                    id="moyenne-entreprise"
                    label=" >20 "
                    name="entreprise-size"
                    onChange={() =>
                      setInfo({ ...info, numEmployees: "moyenne" })
                    }
                    checked={info.numEmployees === "moyenne"}
                  />
                  <Form.Check
                    type="radio"
                    id="grande-entreprise"
                    label=">100"
                    name="entreprise-size"
                    onChange={() =>
                      setInfo({ ...info, numEmployees: "grande" })
                    }
                    checked={info.numEmployees === "grande"}
                  />
                </Col>
              </Row>
              <Row style={{ flex: 1 }}>
                <Form.Label>Secteur d'activité </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={info.secActivity}
                  onChange={(e) =>
                    setInfo({ ...info, secActivity: e.target.value })
                  }
                  style={{ width: "80%", maxHeight: "30%" }}
                >
                  <option value="Graphisme & Design">Graphisme & Design</option>
                  <option value="Programmation & Tech">
                    Programmation & Tech
                  </option>
                  <option value="Rédaction & Traduction">
                    Rédaction & Traduction
                  </option>
                  <option value="Photographie">Photographie</option>
                  <option value="Vidéo & Animation">Vidéo & Animation</option>
                  <option value="Loisirs">Loisirs</option>
                  <option value="Data">Data</option>
                  <option value="Sponsoring">Sponsoring</option>
                  <option value="Musique & audio">Musique & audio</option>
                </Form.Select>
              </Row>
            </div>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Activité</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="text"
                    placeholder="exemple : logistique"
                    value={info.activity}
                    onChange={(e) =>
                      setInfo({ ...info, activity: e.target.value })
                    }
                    disabled={!isInputEnabled}
                  />

                  <InputGroup.Text
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                  >
                    <BsPencil />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group
                as={Col}
                md="5"
                controlId="validationCustom01"
                style={{ width: "50%" }}
              >
                <Form.Label>Site Web</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="text"
                    placeholder="exemple:https://capit.agency/"
                    value={info.website}
                    onChange={(e) =>
                      setInfo({ ...info, website: e.target.value })
                    }
                    disabled={!isInputEnabled}
                  />

                  <InputGroup.Text
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                  >
                    <BsPencil />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Capital social</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="text"
                    placeholder="exemple: numéraire"
                    value={info.capitalSocial}
                    onChange={(e) =>
                      setInfo({ ...info, capitalSocial: e.target.value })
                    }
                    disabled={!isInputEnabled}
                  />
                  <InputGroup.Text
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                  >
                    <BsPencil />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group
                controlId="exampleForm.ControlTextarea1"
                style={{ paddingRight: "5%" }}
              >
                <Form.Label>Bio pour votre entreprise</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={info.bio}
                    onChange={(e) => setInfo({ ...info, bio: e.target.value })}
                    disabled={!isInputEnabled}
                  />
                  <InputGroup.Text
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                  >
                    <BsPencil />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row></Row>

            <div className="profileFormButton">
              <Button
                type="submit"
                onClick={() => applySettings()}
                id="save"
                style={{ backgroundColor: "#5B88D3" }}
              >
                Enregistrer
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <div className="pic card">
        <h3>Ajouter votre logo :</h3>
        <div className="profileDropImg">
          <form className="form">
            <label for="file-input" className="drop-container">
              <span className="drop-title">Drop files here</span>
              or
              <input
                type="file"
                accept="image/*"
                required=""
                id="file-input"
                onChange={handleFileInputChange}
              />
            </label>
            <div className="profileFormButton">
              <Button
                type="submit"
                onClick={() => applyNewPic()}
                id="save"
                style={{ backgroundColor: "#5B88D3" }}
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CompanySettings;
