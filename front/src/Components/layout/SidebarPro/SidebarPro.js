import React, { useContext, useEffect, useState } from "react";
import "./SidebarPro.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartBar,
  faGear,
  faPaste,
  faGears,
  faSignOutAlt,
  faUserSlash,
  faMagnifyingGlass,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import UserService from "../../../Services/UserService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Context, AppContext } from "../../../Context";
import img1 from "../../../images/User.png";

import Offcanvas from "react-bootstrap/Offcanvas";

const SidebarPro = () => {
  const [admin, setAdmin] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({});
  const navigate = useNavigate();
  let context = useContext(AppContext);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const refresh = () => window.location.reload(true);

  const [sidebarShow, setSidebarShow] = useState(false);

  function getCompanyInfo() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .get("http://localhost:3001/users/getCompanyName", headers)
      .then((response) => {
        console.log(response);
        setCompanyInfo(response.data);
      });
  }

  useEffect(() => {
    getCompanyInfo();
  }, []);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  console.log(companyInfo);
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
  }, []);
  return (
    <div className="sideBarProMain">
      <nav className="open">
        <div className="sidebar">
          <div className="dash">
            {" "}
            <br /> <br />
          </div>
          <div className="logo username_card">
            <div className="username_card_image">
              <img
                style={{ marginRight: "10%" }}
                src={companyInfo.picture ? companyInfo.picture : img1}
                height="50%"
                width="60%"
                alt="user profile"
              />
            </div>
            <div className="username_card_info">
              <span className="logo-name username">
                {companyInfo.entrepriseName}
              </span>
            </div>
          </div>

          <div className="sidebar-content">
            <ul className="lists">
              <li className="list">
                <h6 className="helpers">Overview</h6>
                <a href="Dashboard" className="nav-link">
                  <FontAwesomeIcon icon={faHome} className="icon" />
                  <span className="link">Dashboard</span>
                </a>
              </li>
              <li className="list">
                <a href="/CRM" className="nav-link">
                  <FontAwesomeIcon icon={faChartBar} className="icon" />
                  <span className="link">CRM</span>
                </a>
              </li>
              <li className="list">
                <a href="/Archive" className="nav-link">
                  <FontAwesomeIcon icon={faArchive} className="icon" />
                  <span className="link">Archive</span>
                </a>
              </li>
              <h6 className="helpers">Parametres</h6>
              <li className="list">
                <a href="/userSettings" className="nav-link">
                  <FontAwesomeIcon icon={faGear} className="icon" />
                  <span className="link">Paramètre de profil</span>
                </a>
              </li>
              <li className="list">
                <a href="/companySettings " className="nav-link">
                  <FontAwesomeIcon icon={faGears} className="icon" />
                  <span className="link">
                    Paramètre de profil de l'entreprise
                  </span>
                </a>
              </li>
              <li className="list">
                <a className="nav-link" onClick={handleShow}>
                  <FontAwesomeIcon icon={faUserSlash} className="icon" />
                  <span className="link">Supprimer mon compte</span>
                </a>
              </li>
              <li className="list" hidden={!admin}>
                <a href="/RechercheEntreprise " className="nav-link">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
                  <span className="link">Rechercher les entreprises</span>
                </a>
              </li>

              <li className="list">
                <a
                  className="nav-link"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user_data");
                    context.setConfig({
                      ...context.config,
                      isConnected: false,
                    });
                    refresh();
                    navigate("/home", { replace: true });
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                  <span className="link">Déconnecter</span>
                </a>
              </li>
            </ul>
          </div>

          <button
            class="btn btn-primary"
            type="button"
            id="bars-btn"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasTop"
            aria-controls="offcanvasTop"
            variant="primary"
            onClick={() => setSidebarShow(!sidebarShow)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <Offcanvas
            show={sidebarShow}
            onHide={() => setSidebarShow(false)}
            placment={"end"}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="logo username_card">
                <div className="username_card_image">
                  <img
                    style={{ marginRight: "10%" }}
                    src={companyInfo.picture ? companyInfo.picture : img1}
                    height="50%"
                    width="60%"
                    alt="user profile"
                  />
                </div>
                <div className="username_card_info">
                  <span className="logo-name username">
                    {companyInfo.entrepriseName}
                  </span>
                </div>
              </div>
              <div className="sidebar-content">
                <ul className="lists">
                  <li className="list">
                    <h6 className="helpers">Overview</h6>
                    <a href="Dashboard" className="nav-link">
                      <FontAwesomeIcon icon={faHome} className="icon" />
                      <span className="link">Dashboard</span>
                    </a>
                  </li>
                  <li className="list">
                    <a href="/CRM" className="nav-link">
                      <FontAwesomeIcon icon={faChartBar} className="icon" />
                      <span className="link">CRM</span>
                    </a>
                  </li>
                  <li className="ml-auto">
                    <a href="/Archive" className="nav-link">
                      <FontAwesomeIcon icon={faArchive} className="icon" />
                      <span className="link">Archive</span>
                    </a>
                  </li>
                  <h6 className="helpers">Parametres</h6>
                  <li className="list">
                    <a href="/userSettings" className="nav-link">
                      <FontAwesomeIcon icon={faGear} className="icon" />
                      <span className="link"> Paramètre de profil</span>
                    </a>
                  </li>
                  <li className="list">
                    <a href="/companySettings " className="nav-link">
                      <FontAwesomeIcon icon={faGears} className="icon" />
                      <span className="link">
                        Paramètre de profil de l'entreprise
                      </span>
                    </a>
                  </li>
                  <li className="list">
                    <a className="nav-link" onClick={handleShow}>
                      <FontAwesomeIcon icon={faUserSlash} className="icon" />
                      <span className="link">Supprimer mon compte</span>
                    </a>
                  </li>
                  <li className="list" hidden={!admin}>
                    <a href="/RechercheEntreprise " className="nav-link">
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="icon"
                      />
                      <span className="link">Rechercher les entreprises</span>
                    </a>
                  </li>
                  <li className="list">
                    <a
                      className="nav-link"
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user_data");
                        context.setConfig({
                          ...context.config,
                          isConnected: false,
                        });
                        refresh();
                        navigate("/home", { replace: true });
                      }}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                      <span className="link">Déconnecter</span>
                    </a>
                  </li>
                </ul>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </nav>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer Mon Compte</Modal.Title>
        </Modal.Header>
        <Modal.Body>Avez-vous vraiment quitté notre plateforme ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const token = localStorage.getItem("token");
              const headers = {
                headers: {
                  token: token,
                },
              };

              const data = {};
              axios
                .post("http://localhost:3001/users/delUser", data, headers)
                .then((response) => {
                  console.log(response);
                  localStorage.removeItem("token");
                  localStorage.removeItem("user_data");
                  context.setConfig({ ...context.config, isConnected: false });
                  refresh();
                  navigate("/home", { replace: true });
                });
            }}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SidebarPro;
