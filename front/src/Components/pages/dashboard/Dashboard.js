import React, { useEffect, useState, useRef, useContext } from "react";
import { useSocket } from "../../../socketProvider";
import "./Dashboard.css";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faUserCheck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import ReactApexChart from "react-apexcharts";
import PieChart from "../PieChart";

const refresh = () => window.location.reload(true);

function handleStatusColor(status) {
  if (status === "confirmé") {
    return "success";
  }
  if (status === "refusé") {
    return "danger";
  }
}
function handleQualification(prop_id, offer_id, getOffers) {
  const url = "http://localhost:3001/offres/postQualification";
  const token = localStorage.getItem("token");
  const headers = {
    headers: {
      token: token,
    },
  };
  const data = {
    prop_id,
    offer_id,
  };

  axios.post(url, data, headers).then((Response) => {
    getOffers();
  });
}
function handleConfirmation(prop_id, offer_id, userId, socket, getOffers) {
  const url = "http://localhost:3001/offres/postConfirmation";
  const token = localStorage.getItem("token");
  const headers = {
    headers: {
      token: token,
    },
  };

  const data = {
    prop_id,
    offer_id,
  };

  axios.post(url, data, headers).then((Response) => {
    socket.emit("postulerConfirm", {
      userId,
      propId: prop_id,
      offerId: offer_id,
    });

    getOffers();
  });
}

function HandleStatus({ status, prop_id, offer_id, userId, getOffers }) {
  const socket = useSocket();

  if (status === "encours") {
    return (
      <MDBBtn
        className="me-1"
        color="primary"
        onClick={() => handleQualification(prop_id, offer_id, getOffers)}
      >
        Qualifié
      </MDBBtn>
    );
  } else if (status == "Qualifié") {
    return (
      <MDBBtn
        className="me-1"
        color="success"
        onClick={() =>
          handleConfirmation(prop_id, offer_id, userId, socket, getOffers)
        }
      >
        Confirmé
      </MDBBtn>
    );
  } else {
    return (
      <MDBBadge color={handleStatusColor(status)} pill>
        {status}
      </MDBBadge>
    );
  }
}

function Dashboard() {
  const [numberOfOffers, setNumberOfOffers] = useState(0);
  const [encoursPercentage, setEncoursPercentage] = useState(0);
  const [refuséPercentage, setRefuséPercentage] = useState(0);
  const [qualifiéPercentage, setQualifiéPercentage] = useState(0);

  const [chartData, setChartData] = useState({
    series: [], // Your initial data
    options: {
      // Your initial options
    },
  });

  const [revenue, setRevenue] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [confirmationPercentage, setConfirmationPercentage] = useState(0);

  const data = useRef(null);
  const [line, setLine] = useState(null);
  function handleDateFormat(originalDateString) {
    const date = new Date(originalDateString);

    // Get the components of the date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Format the date and time
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDateTime;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .get(
        "http://localhost:3001/propositions/calculatePricePercentage",
        headers
      )
      .then((response) => {
        const { PayedPrice, percentage } = response.data;
        setRevenue(PayedPrice);
        setPercentage(percentage);
      })
      .catch((error) => {
        console.error("Error fetching revenue:", error);
      });
  }, []);

  function getOffers() {
    const url = "http://localhost:3001/offres/getDashOffers";
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios.get(url, headers).then((Response) => {
      data.current = Response.data.myOffersPropositions;
      if (Response.data.myOffersPropositions != null) {
        setLine(
          Array.from(data.current).map((prop) => {
            return (
              <MDBTableBody key={prop._id}>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={prop.proposition.user[0].picture}
                        alt=""
                        style={{ width: "45px", height: "45px" }}
                        className="rounded-circle"
                      />
                      <div className="ms-3">
                        <p className="fw-bold mb-1">
                          {prop.proposition.user[0].entrepriseName}
                        </p>
                        <p className="text-muted mb-0">
                          {prop.proposition.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{prop.titre}</td>
                  <td>{prop.proposition.description}</td>
                  <td>
                    <p>{prop.proposition.phoneNumber}</p>
                  </td>
                  <td>
                    <p>{prop.proposition.prix}DT</p>
                  </td>
                  <td>
                    {Array.from(prop.proposition.competence).map((comp) => {
                      console.log("prop");
                      console.log(prop);
                      const num = prop.proposition.competence.length - 1;
                      const lst = prop.proposition.competence[num];
                      let space = ", ";
                      if (lst === comp) {
                        space = "";
                      }

                      return (
                        <p>
                          {comp}
                          {space}
                        </p>
                      );
                    })}
                  </td>
                  <td>
                    <p>{handleDateFormat(prop.proposition.dateFinale)}</p>
                  </td>
                  <td>
                    {
                      <HandleStatus
                        status={prop.proposition.status}
                        prop_id={prop.proposition._id}
                        offer_id={prop._id}
                        userId={prop.proposition.user_id}
                        getOffers={getOffers}
                      />
                    }
                  </td>
                </tr>
              </MDBTableBody>
            );
          })
        );

        // Calculate the total revenue by month and the corresponding percentages
        const monthlyRevenue = {};
        const confirmedPropositions = Response.data.myOffersPropositions.filter(
          (proposition) => proposition.proposition.status === "confirmé"
        );

        confirmedPropositions.forEach((proposition) => {
          const date = new Date(proposition.proposition.dateFinale);
          const month = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;

          if (!monthlyRevenue[month]) {
            monthlyRevenue[month] = 0;
          }

          monthlyRevenue[month] += parseFloat(proposition.proposition.prix);
        });

        const totalRevenue = Object.values(monthlyRevenue).reduce(
          (total, revenue) => total + revenue,
          0
        );
        const confirmationPercentages = Object.values(monthlyRevenue).map(
          (revenue) => {
            const month = Object.keys(monthlyRevenue).find(
              (key) => monthlyRevenue[key] === revenue
            );
            return {
              x: month,
              y: ((revenue / totalRevenue) * 100).toFixed(2),
            };
          }
        );
        setChartData({
          series: [
            { name: "Revenue", data: Object.values(monthlyRevenue) },
            { name: "Confirmation Percentage", data: confirmationPercentages },
          ],
          options: {
            chart: {
              type: "line",
            },
            xaxis: {
              categories: Object.keys(monthlyRevenue), // Use the months as labels
            },
            yaxis: {
              min: 0,
            },
          },
        });
      }
    });
  }

  useEffect(() => {
    getOffers();
  }, [data]);
  console.log(data);

  useEffect(() => {
    // Fetch the confirmation percentage for the current month and year
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    axios
      .get(
        `http://localhost:3001/propositions/calculateConfirmationPercentageByMonth/${year}/${month}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setConfirmationPercentage(response.data.percentage);
      })
      .catch((error) => {
        console.error("Error fetching confirmation percentage:", error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .get("http://localhost:3001/propositions/statusPercentage", headers)
      .then((response) => {
        const {
          encoursPercentage,
          refuséPercentage,
          qualifiéPercentage,
          confirmationPercentage,
        } = response.data;
        setEncoursPercentage(encoursPercentage);
        setRefuséPercentage(refuséPercentage);
        setQualifiéPercentage(qualifiéPercentage);
        setConfirmationPercentage(confirmationPercentage);
      })
      .catch((error) => {
        console.error("Error fetching confirmation status percentage:", error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .get("http://localhost:3001/offres/nombreoffers", headers)
      .then((response) => {
        const { numberOfOffers } = response.data;
        setNumberOfOffers(numberOfOffers);
      })
      .catch((error) => {
        console.error("Error fetching revenue:", error);
      });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row justify-content-start">
        <div className="col-4">
          <div className="card text-white  mb-3 " id="revenueCard">
            <div className="position-absolute top-0 end-0 p-2">
              <FontAwesomeIcon icon={faWallet} className="icon" />
            </div>
            <div className="card-body" id="DashCard">
              <div className="revenue-container">
                <h3 className="fs-2">Revenues</h3>
                <p className="fs-5">{revenue} DT</p>
              </div>
              <div className="donut-chart-container">
                <div className="donut-chart mr-3">
                  <svg className="donut-circle">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="whitesmoke"
                      strokeWidth="10%"
                      fill="transparent"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="whitesmoke"
                      strokeWidth="10%"
                      fill="transparent"
                      strokeDasharray={`${percentage} ${100 - percentage}`}
                    />
                  </svg>
                  <div className="number">
                    <p>{percentage} %</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card text-white  mb-3 " id="revenueCard">
            <div className="position-absolute top-0 end-0 p-2">
              <FontAwesomeIcon icon={faUserCheck} className="icon" />
            </div>
            <div className="card-body" id="DashCard">
              <h3 className="fs-3">Nombre Des Offres</h3>
              <p className="fs-5">{numberOfOffers} Offres</p>
            </div>
          </div>
        </div>
        <div className="row justify-content-start">
          <div className="col-8">
            <div className="card" style={{ width: "100%", flexGrow: 1 }}>
              <h3 style={{ display: "flex", justifyContent: "center" }}>
                {" "}
                Propositions Confirmées Mensuellement{" "}
              </h3>
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={350}
              />
            </div>
          </div>
          <div className="col-4">
            <div className="card" style={{ width: "100%", flexGrow: 1 }}>
              <h3 style={{ display: "flex", justifyContent: "center" }}>
                Status des offres{" "}
              </h3>

              <PieChart
                encoursPercentage={encoursPercentage}
                refuséPercentage={refuséPercentage}
                qualifiéPercentage={qualifiéPercentage}
                confirmationPercentage={confirmationPercentage}
              />
            </div>
          </div>
        </div>

        <div
          className="row justify-content-start"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div className="profileMain" id="PM">
            <div className="card" style={{ width: "100%", flexGrow: 1 }}>
              <h1 style={{ display: "flex", justifyContent: "center" }}>
                Les Reponses de mes offres
              </h1>
              <MDBTable
                className="dashboard-table "
                align="middle"
                bordered
                style={{
                  border: "1px solid #ccc",
                  borderCollapse: "collapse",
                  width: "95%",
                }}
              >
                <MDBTableHead className="dashboard-head">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Titre</th>
                    <th scope="col">Description</th>
                    <th scope="col">Numero</th>
                    <th scope="col">Prix</th>
                    <th scope="col">Compentance proposé</th>
                    <th scope="col">Date limite</th>
                    <th scope="col">Status</th>
                  </tr>
                </MDBTableHead>
                {line}
              </MDBTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
