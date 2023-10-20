import React, { useState, useEffect, useRef } from "react";
import Footer from "../../Components/Footer/Footer";
import CompanyCard from "./cards/CompanyCard";
import axios from "axios";
import "./Annuaire.css";
import img1 from "../../images/Nouveau dossier/Design.jpg";
import img2 from "../../images/Nouveau dossier/Tech.jpg";
import img3 from "../../images/Nouveau dossier/Traduction.jpg";
import img4 from "../../images/Nouveau dossier/Photographie.jpg";
import img5 from "../../images/Nouveau dossier/Video.jpg";
import img6 from "../../images/Nouveau dossier/Marketing.jpg";
import img7 from "../../images/Nouveau dossier/Ai.jpg";
import img8 from "../../images/Nouveau dossier/Sponsoring.jpg";
import img9 from "../../images/Nouveau dossier/Musique.jpg";

function Annuaire() {
  const [secActivity, setSecActivity] = useState("");
  const companies = useRef(null);
  const [card, setCard] = useState(null);
  const [noCompanies, setNoCompanies] = useState(false);

  function getCompanies(secActivity) {
    console.log(secActivity);
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };
    const data = {
      secActivity: secActivity,
    };

    axios
      .post("http://localhost:3001/users/getCompanies", data, headers)
      .then((response) => {
        console.log(response);
        companies.current = response.data.users;
        if (companies.current.length !== 0) {
          console.log(companies.current);
          setCard(
            Array.from(companies.current).map((company) => (
              <div
                key={company.id}
                className="CardAnu"
                style={{ flexBasis: "30%", margin: "10px" }}
              >
                <CompanyCard company={company} />
              </div>
            ))
          );
          setNoCompanies(false);
        } else {
          setCard(null);
          setNoCompanies(true);
        }
      });
  }

  const options = [
    {
      key: "Graphisme & Design",
      text: "Graphisme & Design",
      value: "Graphisme & Design",
    },
    {
      key: "Programmation & Tech",
      text: "Programmation & Tech",
      value: "Programmation & Tech",
    },
    {
      key: "Rédaction & Traduction",
      text: "Rédaction & Traduction",
      value: "Rédaction & Traduction",
    },
    { key: "Photographie", text: "Photographie", value: "Photographie" },
    {
      key: "Vidéo & Animation",
      text: "Vidéo & Animation",
      value: "Vidéo & Animation",
    },
    {
      key: "Marketing digital",
      text: "Marketing digital",
      value: "Marketing digital",
    },
    { key: "Service Ai", text: "Service Ai", value: "Service Ai" },
    { key: "Sponsoring", text: "Sponsoring", value: "Sponsoring" },
    {
      key: "Musique & audio",
      text: "Musique & audio",
      value: "Musique & audio",
    },
  ];

  const handleImageClick = (secActivity) => {
    getCompanies(secActivity);
    const imageContainers = document.querySelectorAll(".image-container");
    imageContainers.forEach((container) => {
      container.style.display = "none";
    });
  };

  useEffect(() => {
    const imageContainers = document.querySelectorAll(".image-container");
    imageContainers.forEach((container) => {
      container.style.display = "block";
    });
  }, [secActivity]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
            marginTop: "30px",
          }}
        >
          <h1 style={{ color: "#34B6F0" }}>Annuaire</h1>
        </div>
        {noCompanies ? (
          <p>Aucune entreprise dans ce secteur.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", margin: "-5px" }}>
            {card}
          </div>
        )}
        <div className="row">
          <div className="image-container">
            <a
              className="cardAnnuairePh"
              onClick={() => handleImageClick("Graphisme & Design")}
            >
              <img src={img1} alt="Image 1" />
              <div className="CardTextAnn">Graphisme & Design</div>
            </a>
          </div>
          <div className="image-container">
            <a
              className="cardAnnuairePh"
              onClick={() => handleImageClick("Programmation & Tech")}
            >
              <img src={img2} alt="Image 2" />
              <div className="CardTextAnn">Programmation & Tech</div>
            </a>
          </div>
          <div className="image-container">
            <a
              className="cardAnnuairePh"
              onClick={() => handleImageClick("Rédaction & Traduction")}
            >
              <img src={img3} alt="Image 3" />
              <div className="CardTextAnn">Rédaction & Traduction</div>
            </a>
          </div>
        </div>
        <div className="row">
          <div className="image-container">
            <a
              className="cardAnnuairePh"
              onClick={() => handleImageClick("Photographie")}
            >
              <img src={img4} alt="Image 4" />
              <div className="CardTextAnn">Photographie</div>
            </a>
          </div>
          <div className="image-container">
            <a
              className="cardAnnuairePh"
              onClick={() => handleImageClick("Vidéo & Animation")}
            >
              <img src={img5} alt="Image 5" />
              <div className="CardTextAnn">Vidéo & Animation</div>
            </a>
          </div>
          <div className="image-container">
            <a
              className="cardAnnuairePh"
              onClick={() => handleImageClick("Marketing digital")}
            >
              <img src={img6} alt="Image 6" />
              <div className="CardTextAnn">Marketing digital</div>
            </a>
          </div>
        </div>
        <div className="row">
          <div className="image-container">
            <a
              className="cardAnnuairePh"
              onClick={() => handleImageClick("Service Ai")}
            >
              <img src={img7} alt="Image 7" />
              <div className="CardTextAnn">Service Ai</div>
            </a>
          </div>
          <div className="image-container">
            <a
              className="cardAnnuairePh"
              onClick={() => handleImageClick("Sponsoring")}
            >
              <img src={img8} alt="Image 8" />
              <div className="CardTextAnn">Sponsoring</div>
            </a>
          </div>
          <div className="image-container">
            <a
              className="cardAnnuairePh"
              onClick={() => handleImageClick("Musique & audio")}
            >
              <img src={img9} alt="Image 9" />
              <div className="CardTextAnn">Musique & audio</div>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Annuaire;
