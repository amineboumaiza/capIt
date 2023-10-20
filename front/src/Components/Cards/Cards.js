import React, { useState, useEffect, useRef } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import img from "../../images/téléchargement.png";
import "./Cards.css";
import UserService from "../../Services/UserService";
import axios from "axios";
import Formulaire from "../Post Formulaire/Formulaire";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

export default function ProfileStatistics(props) {
  const refresh = () => window.location.reload(true);
  const [admin, setAdmin] = useState(false);
  const [editbtn, SetEditbtn] = useState(null);
  const { offer } = props;
  const [hidden, setHidden] = useState(null);
  const userId = useRef(null);
  console.log(offer);
  function DateDifference() {
    const someDate = new Date(offer.dateCreation);
    const currentDate = new Date();
    const timeDiffInMs = currentDate.getTime() - someDate.getTime();
    let timeDiff = 0;
    let timeUnit = "";

    if (timeDiffInMs < 60000) {
      // Less than 1 minute
      timeDiff = Math.floor(timeDiffInMs / 1000);
      timeUnit = "s";
    } else if (timeDiffInMs < 3600000) {
      // Less than 1 hour
      timeDiff = Math.floor(timeDiffInMs / 60000);
      timeUnit = "m";
    } else if (timeDiffInMs < 86400000) {
      // Less than 1 day
      timeDiff = Math.floor(timeDiffInMs / 3600000);
      timeUnit = "h";
    } else {
      // More than 1 day
      timeDiff = Math.floor(timeDiffInMs / 86400000);
      timeUnit = "d";
    }

    return (
      <div>
        {timeDiff}
        {timeUnit} ago
      </div>
    );
  }

  function getUserId() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    const url = "http://localhost:3001/users/getUserId";

    axios.get(url, headers).then((response) => {
      userId.current = response.data.user._id;
      if (userId.current === offer.creator) {
        SetEditbtn(() => {
          return (
            <a href={`EditOffre/${offer._id}`}>
              <MDBIcon
                icon="edit"
                className="edit-icon"
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                }}
              />
            </a>
          );
        });
      }
    });
  }

  const getAdmin = async () => {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };
    try {
      const response = await UserService.getAdmin(headers);
      setAdmin(response.data.Admin);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAdmin();
    getUserId();
  }, [admin]);

  useEffect(() => {
    getUserId();
  }, [userId]);

  function handleDelete(_id) {
    const url = "http://localhost:3001/offres/deleteOffer";
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };
    const data = {
      _id,
    };

    axios.post(url, data, headers).then((response) => {
      console.log(response);
      refresh();
    });
  }
  function handleDateFormat(originalDateString) {
    const date = new Date(originalDateString);
    console.log(originalDateString);

    // Get the components of the date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Format the date and time
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    console.log(formattedDateTime);
    return formattedDateTime;
  }
  function handleHidden() {
    if (admin) {
      return (
        <MDBIcon
          icon="trash-alt"
          className="delete-icon"
          onClick={() => {
            handleDelete(offer._id);
          }}
        />
      );
    } else if (admin || userId.current === offer.creator) {
      return (
        <MDBIcon
          icon="trash-alt"
          className="delete-icon"
          onClick={() => {
            handleDelete(offer._id);
          }}
        />
      );
    }
  }

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      data-aos="fade-up"
    >
      <MDBContainer className="py-5 cardPost-container">
        <MDBRow>
          <MDBCol
            md="12"
            xl="4"
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <MDBCard
              style={{
                borderRadius: "15px",
                display: "inline",

                width: "250%",
                height: "300%",
                background: "rgba( 188, 161, 217, 0.05 )",
                boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                backdropFilter: "blur( 20px )",
                WebkitBackdropFilter: "blur( 20px )",
                borderRadius: "10px",
                border: "1px solid rgba( 255, 255, 255, 0.18) ",
              }}
            >
              {editbtn}
              <MDBCardBody className="text-center">
                {handleHidden()}
                <MDBCardImage
                  src={offer.user[0]?.picture}
                  className="rounded-circle"
                  fluid
                  style={{ width: "100px" }}
                />
                <div className="my-4">
                  <MDBTypography tag="h4" className="text-center mb-0">
                    {offer.user[0]?.entrepriseName}
                  </MDBTypography>
                  <MDBCardText className="text-muted mb-1 text-center">
                    @{offer.user[0]?.username}
                  </MDBCardText>
                </div>
                <MDBTypography tag="h4" className="text-center">
                  {offer.titre}
                </MDBTypography>
                <MDBCol className="text-start">
                  <MDBCardText className="text-muted mb-4 text-center">
                    {offer.description}
                    <a href="#!"> voir plus</a>
                  </MDBCardText>
                </MDBCol>
                <MDBRow className="mx-auto">
                  <MDBCol className="text-start">
                    <MDBCardText className="text-muted mb-0">
                      Prix : {offer.prix} dt
                    </MDBCardText>
                    <MDBCardText className="text-muted mb-0">
                      Date Debut : {handleDateFormat(offer.dateDebut)}
                    </MDBCardText>
                    <MDBCardText className="text-muted mb-0">
                      Date Finale : {handleDateFormat(offer.dateFin)}
                    </MDBCardText>
                    <MDBCardText className="text-muted mb-0">
                      Technologie :{" "}
                      {Array.from(offer.technologie).map((tech) => {
                        console.log(tech);
                        const num = offer.technologie.length - 1;
                        const lst = offer.technologie[num];
                        let space = ", ";
                        if (lst == tech) {
                          space = "";
                        }

                        return (
                          <p className="text-muted mb-0">
                            {tech}
                            {space}
                          </p>
                        );
                      })}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <Link to={`/Reponse/${offer._id}`}>
                  <MDBBtn
                    rounded
                    size="lg"
                    className="my-4"
                    style={{ scale: "1.2" }}
                  >
                    Postuler
                  </MDBBtn>
                </Link>
                <Link to={`/chat/`} state={{ creator: offer.creator }}>
                  <MDBBtn
                    rounded
                    size="lg"
                    className="my-4"
                    style={{ scale: "1.2" }}
                  >
                    <FontAwesomeIcon icon={faMessage} />
                  </MDBBtn>
                </Link>
                <div>
                  <MDBCardText
                    className="text-muted mb-3"
                    style={{ marginLeft: "80%", marginTop: "10%" }}
                  >
                    {DateDifference()}
                  </MDBCardText>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
