import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  Navbar,
  Form,
  FormControl,
  Offcanvas,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUser,
  faSearch,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import EmailConfirmationBar from "./../Confirme/Confirme.js";
import "./Navbaruser.css";
import Brand from "../../images/1.png";
import { Badge } from "primereact/badge";
import { useNavigate } from "react-router-dom";
import { Context, AppContext } from "../../Context";
import UserService from "../../Services/UserService";
import axios from "axios";
import { SearchBar } from "./Search/SearchBar";
import { SearchResultsList } from "./Search/SearchResultsList";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSocket } from "../../socketProvider";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { Badge as Bdg } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";

const CustomNavbar = () => {
  const [results, setResults] = useState([]);
  const [admin, setAdmin] = useState(false);
  const refresh = () => window.location.reload(true);
  const navigate = useNavigate();
  let context = useContext(AppContext);
  const [username, setUsername] = useState({});
  const socket = useSocket();
  const [notificationFlag, setNotificationFlag] = useState(false);
  const [parameterCounter, setParameterCounter] = useState(0);

  const [notifications, setNotifications] = useState([]);

  const checkNotifications = () => {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios.get("http://localhost:3001/notifications/nb", headers).then((res) => {
      const notificationsNumber = res.data["notificationsNumber"];
      setParameterCounter(notificationsNumber);
    });
  };

  useEffect(() => {
    if (socket == null) return;

    socket.on("newProposition", ({ titre }) => {
      checkNotifications();
      console.log("socketed new prop");

      toast.info(
        <p
          onClick={() => {
            navigate("/Dashboard");
          }}
        >
          Vous avez une nouvelle proposition pour l'offre:
          <span style={{ color: "green", fontWeight: "bolder" }}> {titre}</span>
        </p>,
        {
          position: "bottom-left",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    });

    socket.on("postulerConfirmNotification", () => {
      checkNotifications();

      toast.info(
        <p
          onClick={() => {
            navigate("/CRM");
          }}
        >
          Un offre que vous avez postulé a été traité.
        </p>,
        {
          position: "bottom-left",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    });

    return () => {
      socket.off("newProposition");
      socket.off("postulerConfirmNotification");
    };
  }, [socket]);

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

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

  function getUsername() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .get(`http://localhost:3001/users/getUsername`, headers)
      .then((response) => {
        console.log(response);
        setUsername(response.data.user);
        console.log(username);
      });
  }

  const getAllNotifications = () => {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios.get("http://localhost:3001/notifications/", headers).then((res) => {
      let notifs = [...res.data["notifications"]];
      setNotifications(notifs);
      setNotificationFlag(true);
    });
  };

  useEffect(() => {
    getAdmin();
    getUsername();
    checkNotifications();
    getAllNotifications();
  }, []);

  const [suggestions, setSuggestions] = useState([]); // State to store the suggested users

  const handleInputChange = async (e) => {
    const query = e.target.value; // Get the input value
    try {
      // Make an API request to the server to fetch the suggested users based on the input value
      const response = await axios.get(
        `http://127.0.0.1:3001/users/search/${query}`
      );
      setSuggestions(response.data); // Update the state with the fetched suggested users
    } catch (err) {
      console.error(err);
    }
  };

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleOffcanvasToggle = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const handleDropDownToggle = (show) => {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    if (!show) {
      setParameterCounter(0);
      const notifs = notifications
        .filter((notification) => notification.isRead === false)
        .map((notification) => notification._id);
      if (notifs.length > 0)
        axios.put(
          "http://localhost:3001/notifications/update",
          { notifs },
          headers
        );
      return;
    }

    axios.get("http://localhost:3001/notifications/", headers).then((res) => {
      let notifs = [...res.data["notifications"]];
      setNotifications(notifs);
    });
  };

  const getTimePassed = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now.getTime() - notifDate.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) {
      return "Maintenant";
    } else if (minutes < 60) {
      return `Il y'a ${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `Il y'a ${hours} hour${hours !== 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days}j`;
    }
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 999,
        width: "100%",
      }}
    >
      <ToastContainer
        transition={Zoom}
        position="bottom-left"
        autoClose={6000}
        hideProgressBar
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        closeOnClick
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar expand="lg" bg="light" variant="light" className="NavM">
        <Navbar.Brand href="#">
          <a href="/home">
            <img
              src={Brand}
              alt="CAPITALL"
              width={120}
              height={120}
              style={{
                marginLeft: "70%",
              }}
              className="Brandlogo"
            />
          </a>
        </Navbar.Brand>
        {/* <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={handleOffcanvasToggle}
        />*/}
        <Button onClick={handleOffcanvasToggle} id="nav">
          <i className="fas fa-bars"></i>
        </Button>
        <Navbar.Collapse id="navbar-nav">
          <div className="search-bar-container">
            <SearchBar setResults={setResults} />
            {results && results.length > 0 && (
              <SearchResultsList results={results} />
            )}
          </div>
          <div className="navbar-nav ms-auto" style={{ marginRight: "3%" }}>
            {/* Show the buttons only when the offcanvas is closed */}
            {!showOffcanvas && (
              <>
                <Dropdown className="mn-btn ">
                  <Dropdown.Toggle variant="primary" className="me-2">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      href="/NouveauOffre"
                      style={{ marginRight: "5%" }}
                    >
                      <AiOutlinePlusCircle /> Nouvelle Offre
                    </Dropdown.Item>
                    <Dropdown.Item hidden={!admin} href="/NouveauBlog">
                      Nouveau Blog
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button
                  href="/Offres"
                  variant="outline-secondary"
                  className="me-2"
                >
                  Offres
                </Button>
                <Button
                  href="/Annuaire"
                  variant="outline-secondary"
                  className="me-2"
                >
                  Annuaire
                </Button>
                <Dropdown onToggle={(show) => handleDropDownToggle(show)}>
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="dropdown-basic"
                  >
                    <Bdg
                      color="secondary"
                      max={9}
                      badgeContent={parameterCounter}
                    >
                      <FontAwesomeIcon icon={faBell} className="me-2" />
                    </Bdg>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end dropdown-size">
                    <Dropdown.ItemText>
                      <div className="notification-ui_dd-header">
                        <h3 className="text-center">Notifications</h3>
                      </div>
                    </Dropdown.ItemText>
                    {notifications.length === 0 ? (
                      <Dropdown.ItemText style={{ color: "gray" }}>
                        aucune notification.
                      </Dropdown.ItemText>
                    ) : (
                      notifications.map((notification) => {
                        if (notification.notificationType === "proposition")
                          return (
                            <Dropdown.Item
                              key={notification._id}
                              style={{ padding: 0 }}
                            >
                              <HashLink
                                to="/Dashboard"
                                className={
                                  notification.isRead
                                    ? "mt-1 notification-list text-dark"
                                    : "mt-1 notification-list notification-list--unread text-dark"
                                }
                              >
                                <div class="notification-list_detail">
                                  <p>
                                    <b>Proposition d'offre</b> <br />
                                    <span class="text-muted">
                                      {notification.offer.titre}
                                    </span>
                                  </p>
                                  <p class="nt-link text-truncate">
                                    un candidat a postulé a votre offre
                                  </p>
                                </div>
                                <p>
                                  <small>
                                    {getTimePassed(notification.createdAt)}
                                  </small>
                                </p>
                              </HashLink>
                            </Dropdown.Item>
                          );
                        if (
                          notification.notificationType === "reponseProposition"
                        )
                          return (
                            <Dropdown.Item
                              key={notification._id}
                              style={{ padding: 0 }}
                            >
                              <HashLink
                                to="/CRM"
                                className={
                                  notification.isRead
                                    ? "mt-1 notification-list text-dark"
                                    : "mt-1 notification-list notification-list--unread text-dark"
                                }
                              >
                                <div class="notification-list_detail">
                                  <p>
                                    <b>Réponse à une Proposition</b> <br />
                                    <span class="text-muted">
                                      {notification.offer.titre}
                                    </span>
                                  </p>
                                  <p class="nt-link text-truncate">
                                    Votre proposition a été traité
                                  </p>
                                </div>
                                <p>
                                  <small>
                                    {getTimePassed(notification.createdAt)}
                                  </small>
                                </p>
                              </HashLink>
                            </Dropdown.Item>
                          );
                      })
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown className="ms-2">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="dropdown-basic"
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end">
                    <Dropdown.Item href={`/Profile/${username.username}`}>
                      Profile
                    </Dropdown.Item>

                    <Dropdown.Item href="/Settings">Paramètre</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
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
                      Déconnexion
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Navbar>

      {/* Offcanvas for mobile */}
      <Offcanvas
        show={showOffcanvas}
        onHide={handleOffcanvasToggle}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Capit All</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-column">
            <Button href="/NouveauOffre" className="mb-2">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Nouvelle Offre
            </Button>
            {admin && (
              <Button href="/NouveauBlog" className="mb-2">
                Nouveau Blog
              </Button>
            )}
            <Button href="/Offres" variant="outline-secondary" className="mb-2">
              Offres
            </Button>
            <Button
              href="/Annuaire"
              variant="outline-secondary"
              className="mb-2"
            >
              Annuaire
            </Button>
            <Button href={`/Profile/${username.username}`} className="mb-2">
              Profile
            </Button>
            <Button href="/Settings" className="mb-2">
              Paramètre
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user_data");
                context.setConfig({ ...context.config, isConnected: false });
                refresh();
                navigate("/home", { replace: true });
              }}
            >
              Déconnexion
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <EmailConfirmationBar />
    </div>
  );
};

export default CustomNavbar;
