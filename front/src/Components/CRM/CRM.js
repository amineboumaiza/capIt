import React, { useEffect, useState } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CRM.css";

export default function CRM() {
  const [newPropositions, setNewPropositions] = useState([]);
  const [qualification, setQualification] = useState([]);
  const [priceProposition, setPriceProposition] = useState([]);
  const [confirmation, setConfirmation] = useState([]);
  const [showInfo, setShowInfo] = useState(true);
  const [clickedCards, setClickedCards] = useState([]);

  function handleStatus(status) {
    if (status === "encours") {
      return "warning";
    }
    if (status === "Qualifié") {
      return "primary";
    }
    if (status === "confirmé") {
      return "success";
    }
    if (status === "refusé") {
      return "danger";
    }
    if (status === "Qualifié") {
      return "primary";
    }
  }

  function handleDateFormat(originalDateString) {
    const date = new Date(originalDateString);
    const formattedDateTime = date.toLocaleString();
    return formattedDateTime;
  }

  function toggleInfo(id) {
    setClickedCards((prevClickedCards) => {
      if (prevClickedCards.includes(id)) {
        return prevClickedCards.filter((cardId) => cardId !== id);
      } else {
        return [...prevClickedCards, id];
      }
    });
    setShowInfo((prevShowInfo) => !prevShowInfo);
  }

  function getOffers() {
    const url = "http://localhost:3001/offres/getOffersProposed";
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios.get(url, headers).then((response) => {
      const newProps = [];
      const qualProps = [];
      const newProps2 = [];
      const qualProps2 = [];
      const newProps3 = [];

      const priceProps = [];
      const confirmProps = [];

      const propositions = response.data.userPropositions.map((prop, index) => {
        const compositeKey =
          prop.id && prop.offerId ? `${prop.id}-${prop.offerId}` : index;

        const card = (
          <MDBCol
            id="carta"
            key={compositeKey}
            onClick={() => toggleInfo(prop.id)}
          >
            <MDBCard
              className={`${
                clickedCards.includes(prop.id) ? "clicked-card" : ""
              }`}
              key={compositeKey}
            >
              <MDBCardBody>
                <div className="d-flex align-items-center">
                  <img
                    src={prop.user[0].picture}
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">
                      {prop.user[0].entrepriseName}
                    </p>
                    <p className="text-muted mb-0">{prop.user[0].email}</p>
                  </div>
                </div>
                <p className="fw-normal mb-1 text-center">
                  Titre: {prop.offer[0].titre}
                </p>
                {showInfo && (
                  <>
                    <div className="text-center">
                      Technologies requises :{" "}
                      {prop.offer[0].technologie.map((tech, index) => {
                        const isLast =
                          index === prop.offer[0].technologie.length - 1;
                        const separator = isLast ? "" : ", ";
                        return (
                          <p
                            className="text-muted mt-0 mb-0 text-center"
                            style={{ display: "inline", textAlign: "center" }}
                            key={tech}
                          >
                            {tech}
                            {separator}
                          </p>
                        );
                      })}
                    </div>
                    <p className="fw-normal mb-1 text-center">
                      Discription: {prop.description}
                    </p>
                    <p className="text-center">Prix: {prop.prix} DT</p>
                    <div className="text-center">
                      Compétances :{" "}
                      {prop.competence.map((comp, index) => {
                        const isLast = index === prop.competence.length - 1;
                        const separator = isLast ? "" : ", ";
                        return (
                          <span key={comp}>
                            {comp}
                            {separator}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
                <p className="text-center">
                  {handleDateFormat(prop.dateFinale)}
                  <br />
                  <MDBBadge
                    color={handleStatus(prop.status)}
                    pill
                    className="mt-3"
                  >
                    <span className="align-middle">{prop.status}</span>
                  </MDBBadge>
                </p>
                {prop.status === "Qualifié" && (
                  <Link to={`/chat`} state={{ offerId: prop.offer[0]._id }}>
                    <MDBBadge
                      color={handleStatus(prop.status)}
                      pill
                      className="mt-3"
                    >
                      <span>
                        <FontAwesomeIcon icon={faMessage} />
                      </span>
                    </MDBBadge>
                  </Link>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        );

        if (prop.status === "encours") {
          newProps3.push(card);
        } else if (prop.status === "Qualifié") {
          newProps2.push(
            <MDBCol id="carta" key={compositeKey} style={{ opacity: "0.5" }}>
              <MDBCard
                className={`${
                  clickedCards.includes(prop.id) ? "clicked-card" : ""
                }`}
                key={compositeKey}
              >
                <MDBCardBody>
                  <img src="/tick.png" alt="Tick" className="tick-image" />
                  <div className="d-flex align-items-center">
                    <img
                      src={prop.user[0].picture}
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                      className="rounded-circle"
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">
                        {prop.user[0].entrepriseName}
                      </p>
                      <p className="text-muted mb-0">{prop.user[0].email}</p>
                    </div>
                  </div>
                  <p className="fw-normal mb-1 text-center">
                    Titre: {prop.offer[0].titre}
                  </p>
                  {showInfo && (
                    <>
                      <div className="text-center">
                        Technologies requises :{" "}
                        {prop.offer[0].technologie.map((tech, index) => {
                          const isLast =
                            index === prop.offer[0].technologie.length - 1;
                          const separator = isLast ? "" : ", ";
                          return (
                            <p
                              className="text-muted mt-0 mb-0 text-center"
                              style={{ display: "inline", textAlign: "center" }}
                              key={tech}
                            >
                              {tech}
                              {separator}
                            </p>
                          );
                        })}
                      </div>
                      <p className="fw-normal mb-1 text-center">
                        Discription: {prop.description}
                      </p>
                      <p className="text-center">Prix: {prop.prix} DT</p>
                      <div className="text-center">
                        Compétances :{" "}
                        {prop.competence.map((comp, index) => {
                          const isLast = index === prop.competence.length - 1;
                          const separator = isLast ? "" : ", ";
                          return (
                            <span key={comp}>
                              {comp}
                              {separator}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <p className="text-center">
                    {handleDateFormat(prop.dateFinale)}
                    <br />
                    <MDBBadge
                      color={handleStatus(prop.status)}
                      pill
                      className="mt-3"
                    >
                      <span className="align-middle">{prop.status}</span>
                    </MDBBadge>
                  </p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          );
          qualProps2.push(card);
        } else if (prop.status === "confirmé") {
          confirmProps.push(
            <MDBCol id="carta" key={compositeKey}>
              <MDBCard
                className={`${
                  clickedCards.includes(prop.id) ? "clicked-card" : ""
                }`}
                key={compositeKey}
              >
                <MDBCardBody>
                  <div className="d-flex align-items-center">
                    <img
                      src={prop.user[0].picture}
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                      className="rounded-circle"
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">
                        {prop.user[0].entrepriseName}
                      </p>
                      <p className="text-muted mb-0">{prop.user[0].email}</p>
                    </div>
                  </div>
                  <p className="fw-normal mb-1 text-center">
                    Titre: {prop.offer[0].titre}
                  </p>
                  {
                    <>
                      <div className="text-center">
                        Technologies requises :{" "}
                        {prop.offer[0].technologie.map((tech, index) => {
                          const isLast =
                            index === prop.offer[0].technologie.length - 1;
                          const separator = isLast ? "" : ", ";
                          return (
                            <p
                              className="text-muted mt-0 mb-0 text-center"
                              style={{ display: "inline", textAlign: "center" }}
                              key={tech}
                            >
                              {tech}
                              {separator}
                            </p>
                          );
                        })}
                      </div>
                      <p className="fw-normal mb-1 text-center">
                        Discription: {prop.description}
                      </p>
                      <p className="text-center">Prix: {prop.prix} DT</p>
                      <div className="text-center">
                        Compétances :{" "}
                        {prop.competence.map((comp, index) => {
                          const isLast = index === prop.competence.length - 1;
                          const separator = isLast ? "" : ", ";
                          return (
                            <span key={comp}>
                              {comp}
                              {separator}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  }
                  <p className="text-center">
                    {handleDateFormat(prop.dateFinale)}
                    <br />
                    <MDBBadge
                      color={handleStatus(prop.status)}
                      pill
                      className="mt-3"
                    >
                      <span className="align-middle">{prop.status}</span>
                    </MDBBadge>
                  </p>
                  {prop.status === "Qualifié" && (
                    <Link to={`/chat`} state={{ offerId: prop.offer[0]._id }}>
                      <MDBBadge
                        color={handleStatus(prop.status)}
                        pill
                        className="mt-3"
                      >
                        <span>
                          <FontAwesomeIcon icon={faMessage} />
                        </span>
                      </MDBBadge>
                    </Link>
                  )}
                  <Link to={"/Vente"} state={{ propId: prop._id }}>
                    <button className="butt">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                        ></path>
                      </svg>
                      <div class="text">Facturation</div>
                    </button>
                  </Link>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          );
          newProps.push(
            <MDBCol id="carta" key={compositeKey} style={{ opacity: "0.5" }}>
              <MDBCard
                className={`${
                  clickedCards.includes(prop.id) ? "clicked-card" : ""
                }`}
                key={compositeKey}
              >
                <MDBCardBody>
                  <img src="/tick.png" alt="Tick" className="tick-image" />
                  <div className="d-flex align-items-center">
                    <img
                      src={prop.user[0].picture}
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                      className="rounded-circle"
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">
                        {prop.user[0].entrepriseName}
                      </p>
                      <p className="text-muted mb-0">{prop.user[0].email}</p>
                    </div>
                  </div>
                  <p className="fw-normal mb-1 text-center">
                    Titre: {prop.offer[0].titre}
                  </p>
                  {showInfo && (
                    <>
                      <div className="text-center">
                        Technologies requises :{" "}
                        {prop.offer[0].technologie.map((tech, index) => {
                          const isLast =
                            index === prop.offer[0].technologie.length - 1;
                          const separator = isLast ? "" : ", ";
                          return (
                            <p
                              className="text-muted mt-0 mb-0 text-center"
                              style={{ display: "inline", textAlign: "center" }}
                              key={tech}
                            >
                              {tech}
                              {separator}
                            </p>
                          );
                        })}
                      </div>
                      <p className="fw-normal mb-1 text-center">
                        Discription: {prop.description}
                      </p>
                      <p className="text-center">Prix: {prop.prix} DT</p>
                      <div className="text-center">
                        Compétances :{" "}
                        {prop.competence.map((comp, index) => {
                          const isLast = index === prop.competence.length - 1;
                          const separator = isLast ? "" : ", ";
                          return (
                            <span key={comp}>
                              {comp}
                              {separator}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <p className="text-center">
                    {handleDateFormat(prop.dateFinale)}
                    <br />
                    <MDBBadge
                      color={handleStatus(prop.status)}
                      pill
                      className="mt-3"
                    >
                      <span className="align-middle">{prop.status}</span>
                    </MDBBadge>
                  </p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          );
          qualProps.push(
            <MDBCol id="carta" key={compositeKey} style={{ opacity: "0.5" }}>
              <MDBCard
                className={`${
                  clickedCards.includes(prop.id) ? "clicked-card" : ""
                }`}
                key={compositeKey}
              >
                <MDBCardBody>
                  <img src="/tick.png" alt="Tick" className="tick-image" />
                  <div className="d-flex align-items-center">
                    <img
                      src={prop.user[0].picture}
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                      className="rounded-circle"
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">
                        {prop.user[0].entrepriseName}
                      </p>
                      <p className="text-muted mb-0">{prop.user[0].email}</p>
                    </div>
                  </div>
                  <p className="fw-normal mb-1 text-center">
                    Titre: {prop.offer[0].titre}
                  </p>
                  {showInfo && (
                    <>
                      <div className="text-center">
                        Technologies requises :{" "}
                        {prop.offer[0].technologie.map((tech, index) => {
                          const isLast =
                            index === prop.offer[0].technologie.length - 1;
                          const separator = isLast ? "" : ", ";
                          return (
                            <p
                              className="text-muted mt-0 mb-0 text-center"
                              style={{ display: "inline", textAlign: "center" }}
                              key={tech}
                            >
                              {tech}
                              {separator}
                            </p>
                          );
                        })}
                      </div>
                      <p className="fw-normal mb-1 text-center">
                        Discription: {prop.description}
                      </p>
                      <p className="text-center">Prix: {prop.prix} DT</p>
                      <div className="text-center">
                        Compétances :{" "}
                        {prop.competence.map((comp, index) => {
                          const isLast = index === prop.competence.length - 1;
                          const separator = isLast ? "" : ", ";
                          return (
                            <span key={comp}>
                              {comp}
                              {separator}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <p className="text-center">
                    {handleDateFormat(prop.dateFinale)}
                    <br />
                    <MDBBadge
                      color={handleStatus(prop.status)}
                      pill
                      className="mt-3"
                    >
                      <span className="align-middle">{prop.status}</span>
                    </MDBBadge>
                  </p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          );
        }
      });

      qualProps.push(qualProps2);
      newProps.push(newProps2);
      newProps.push(newProps3);
      setNewPropositions(newProps);
      setQualification(qualProps);
      setConfirmation(confirmProps);
    });
  }

  useEffect(() => {
    getOffers();
  }, []);

  return (
    <MDBContainer className="crm-container">
      <h1 className="mt-5 mb-4 text-center">CRM</h1>
      <div className="d-flex">
        <div className="me-5">
          <h2 className="mb-4 text-center">Nouvelle</h2>
          {newPropositions.length > 0 ? (
            <MDBRow className="d-flex flex-column">{newPropositions}</MDBRow>
          ) : (
            <p>No new propositions</p>
          )}
        </div>
        <div className="vertical-line"></div>
        <div className="me-5">
          <h2 className="mb-4 text-center">Qualification</h2>
          {qualification.length > 0 ? (
            <MDBRow className="d-flex flex-column">{qualification}</MDBRow>
          ) : (
            <p>No qualifications</p>
          )}
        </div>
        <div className="vertical-line"></div>
        <div>
          <h2 className="mb-4 text-center">Confirmation</h2>
          {confirmation.length > 0 ? (
            <MDBRow className="d-flex flex-column">{confirmation}</MDBRow>
          ) : (
            <p>No confirmations</p>
          )}
        </div>
      </div>
    </MDBContainer>
  );
}
