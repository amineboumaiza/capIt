import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import "./Postuler.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../socketProvider";

function Postuler() {
  const navigate = useNavigate();
  const { id } = useParams();
  const socket = useSocket();
  console.log(id);
  const [info, setInfo] = useState({
    description: "",
    email: "",
    prix: "",
    phoneNumber: "",
    dateFinale: null,
    competence: null,
    offer_id: id,
  });

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
    { name: "Spring Boot" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    postProposition(info);
  };

  function postProposition(data) {
    const url = "http://localhost:3001/propositions/postProposition";
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .post(url, data, headers)
      .then((response) => {
        console.log("Response from the server:", response.data); // Debug log

        socket.emit("postuler", { offerId: id });
        navigate("/CRM", { replace: true });
      })
      .catch((error) => {
        console.log("Response from the server:", error.response); // Debug log

        if (
          error.response.data.msg === "You cannot propose to your own offer"
        ) {
          alert(`Vous ne pouvez pas postuler sur votre offre !`);
        } else if (
          error.response.data.msg === "You already Proposed to this offer"
        ) {
          alert("Vous avez déjà postulé !");
        } else {
          alert("An unknown error occurred");
        }
      });
  }
  function getEmailCompany() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .get("http://localhost:3001/users/getEmailCompany", headers)
      .then((response) => {
        console.log(response);
        // setInfo(response.data);
        setInfo({
          ...info,
          email: response.data.user.email,
          phoneNumber: response.data.user.phoneNumber,
        });
      });
  }

  useEffect(() => {
    getEmailCompany();
  }, []);

  return (
    <>
      <h2
        style={{ color: "#0D6EFD", display: "flex", justifyContent: "center" }}
      >
        Propostion Pour l'offre{" "}
      </h2>
      <div className="PostulerForm">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="description">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              value={info.description}
              onChange={(e) =>
                setInfo({ ...info, description: e.target.value })
              }
              rows={4}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="email">
            <Form.Label>Numero de telephone</Form.Label>
            <Form.Control
              type="text"
              value={info.phoneNumber}
              onChange={(e) =>
                setInfo({ ...info, phoneNumber: e.target.value })
              }
            />
          </Form.Group>
          <br />
          <Form.Group controlId="prix">
            <Form.Label style={{ marginRight: "10%" }}>Prix : </Form.Label>
            <InputNumber
              inputId="currency-tunisia"
              value={info.prix}
              onValueChange={(e) => setInfo({ ...info, prix: e.target.value })}
              mode="currency"
              currency="TND"
              locale="fr-TN"
            />
          </Form.Group>
          <br />
          <div>
            <Form.Group controlId="datedebut">
              <Form.Label style={{ marginRight: "1%" }}>
                Date finale :{" "}
              </Form.Label>
              <Calendar
                value={info.dateFinale}
                onChange={(e) =>
                  setInfo({ ...info, dateFinale: e.target.value })
                }
                showTime
                hourFormat="24"
              />
            </Form.Group>
          </div>
          <br />
          <div className="multiselect-container form-group-container">
            <Form.Group controlId="compétences">
              <Form.Label className="form-label">
                Compétences requises :
              </Form.Label>
              <MultiSelect
                className="form-input"
                value={info.competence}
                options={technologie}
                onChange={(e) =>
                  setInfo({ ...info, competence: e.target.value })
                }
                optionLabel="name"
                optionValue="name"
                placeholder="Sélectionnez les compétences requises"
              />
            </Form.Group>
          </div>
          <br />
          <button className="SendPost">
            <div class="svg-wrapper-1">
              <div class="svg-wrapper">
                <svg
                  height="24"
                  width="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </div>
            <span>Postuler</span>
          </button>
        </Form>
      </div>
    </>
  );
}

export default Postuler;
