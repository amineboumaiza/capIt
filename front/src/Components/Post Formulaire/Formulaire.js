import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";
import "./Formulaire.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function Formulaire() {
  const { id } = useParams();
  console.log("hethy l id", id);
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    titre: "",
    description: "",
    dateDebut: null,
    dateFin: null,
    prix: "",
    technologie: null,
  });

  if (id != null) {
    console.log("testtt");
  }

  const technologie = [
    { name: "python" },
    { name: "React" },
    { name: "Angular" },
    { name: "java" },
    { name: "Javascript" },
    { name: "php" },
    { name: "NodeJs" },
    { name: "Adobe Photoshop" },
    { name: "Java/J2EE" },
    { name: "SQL" },
    { name: "Mongodb" },
    { name: "WordPress" },
    { name: "Symfony" },
    { name: "Android" },
    { name: "Machine Learning" },
    { name: "MySQL" },
    { name: "Java" },
    { name: "Data Science" },
    { name: "Informatique" },
    { name: "Adobe Illustrator" },
    { name: "Négociation" },
    { name: "Deep Learning" },
    { name: "Design Graphique" },
    { name: "Spring Boot", name: "Autre" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    postOffer(info);
  };

  function getOffer(id) {
    const url = "http://localhost:3001/offres/getOffer";
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    const data = {
      id: id,
    };

    axios.post(url, data, headers).then((response) => {
      setInfo(response.data.offer);
      console.log(response);
    });
  }

  function postOffer(data) {
    let url;
    if (id != null) {
      url = "http://localhost:3001/offres/editOffer";
    } else {
      url = "http://localhost:3001/offres/postOffer";
    }
    console.log(url);

    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios.post(url, data, headers).then((response) => {
      console.log(response);
      navigate("/Offres", { replace: true });
    });
  }
  useEffect(() => {
    if (id != null) {
      getOffer(id);
    }
  }, []);
  console.log(info);
  function handleBtnNaming() {
    if (id != null) {
      return "Modifier";
    } else {
      return "Créer";
    }
  }

  return (
    <div className="profileMain" id="formulaireMain">
      <div className="card" id="formulaireCard" style={{ width: "250%" }}>
        <h4 style={{ fontSize: "150%" }}>Publier Votre Offre : </h4>
        <div className="puts">
          <Form onSubmit={handleSubmit} className="FormulairePost">
            <div className="form-group-container">
              <Form.Group controlId="titre">
                <Form.Label className="form-label">Titre de l'offre</Form.Label>
                <Form.Control
                  className="form-input"
                  type="text"
                  value={info.titre}
                  onChange={(e) => setInfo({ ...info, titre: e.target.value })}
                />
              </Form.Group>
            </div>

            <div className="form-group-container">
              <Form.Group controlId="description">
                <Form.Label className="form-label">Description</Form.Label>
                <InputTextarea
                  className="form-input"
                  value={info.description}
                  onChange={(e) =>
                    setInfo({ ...info, description: e.target.value })
                  }
                  rows={5}
                  cols={30}
                />
              </Form.Group>
            </div>

            <div className="form-group-container">
              <Form.Group controlId="datedebut">
                <Form.Label className="form-label">De</Form.Label>
                <Calendar
                  className="form-input"
                  value={info.dateDebut}
                  onChange={(e) =>
                    setInfo({ ...info, dateDebut: e.target.value })
                  }
                  showTime
                  hourFormat="24"
                />
              </Form.Group>
            </div>

            <div className="form-group-container">
              <Form.Group controlId="datefin">
                <Form.Label className="form-label">à</Form.Label>
                <Calendar
                  className="form-input"
                  value={info.dateFin}
                  onChange={(e) =>
                    setInfo({ ...info, dateFin: e.target.value })
                  }
                  showTime
                  hourFormat="24"
                />
              </Form.Group>
            </div>

            <div className="form-group-container">
              <Form.Group controlId="prix">
                <Form.Label className="form-label">Prix :</Form.Label>
                <InputNumber
                  className="form-input"
                  inputId="currency-tunisia"
                  value={info.prix}
                  onValueChange={(e) =>
                    setInfo({ ...info, prix: e.target.value })
                  }
                  mode="currency"
                  currency="TND"
                  locale="fr-TN"
                />
              </Form.Group>
            </div>

            <div className="multiselect-container form-group-container">
              <Form.Group controlId="compétences">
                <Form.Label className="form-label">
                  Compétences requises :
                </Form.Label>
                <MultiSelect
                  className="form-input"
                  value={info.technologie}
                  options={technologie}
                  onChange={(e) =>
                    setInfo({ ...info, technologie: e.target.value })
                  }
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Sélectionnez les compétences requises"
                />
              </Form.Group>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="submit-button"
              style={{ marginRight: "80%" }}
            >
              {handleBtnNaming()}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default Formulaire;

