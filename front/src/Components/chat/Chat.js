//front chat.js

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ChatBox from "../ChatBox/ChatBox";
import "./chat.css";
import { useSocket } from "../../socketProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";
import { Badge } from "@mui/material";

let entreprises = [];
export default function Chat() {
  const [chatBadges, setChatBadges] = useState({});
  const [companyInfo, setCompanyInfo] = useState("");
  const [companiesInfo, setCompaniesInfo] = useState([]);
  const [textAreaInput, setTextAreaInput] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedEnterpriseInfo, setSelectedEnterpriseInfo] = useState(null); // New state variable
  const [username, setUsername] = useState({});
  const navigate = useNavigate();
  const socket = useSocket();
  const textAreaRef = useRef();
  const location = useLocation();

  async function getUsername() {
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

  const updateBadges = async () => {
    const badgesList = {};
    for (const company of companiesInfo) {
      badgesList[company.entrepriseName] = company.unreadCount;
    }
    setChatBadges(badgesList);
  };

  useEffect(() => {
    console.log(chatBadges);
  }, [chatBadges]);

  const handleEnterpriseClick = async (companyName, company) => {
    setDiscussion(companyName);
    let enterpriseInfo = entreprises.find(
      (company) => company.entrepriseName === companyName
    );
    if (!enterpriseInfo && company) {
      enterpriseInfo = company;
      entreprises = [...entreprises, company];
      setCompaniesInfo((prev) => {
        return [...prev, company];
      });
    }
    setSelectedEnterpriseInfo(enterpriseInfo);
  };

  async function getCompanyInfo() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .get("http://localhost:3001/users/getCompanyName", headers)
      .then((response) => {
        setCompanyInfo(response.data);
      });
  }

  async function getCompaniesInfo() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };
    return axios.get(
      "http://localhost:3001/messages/all-messaged-companies",
      headers
    );
  }

  const handleLocation = async () => {
    if (location.state?.creator) {
      const creatorId = location.state?.creator;
      const token = localStorage.getItem("token");
      const headers = {
        headers: {
          token: token,
        },
      };
      axios
        .get(
          `http://localhost:3001/users/getCompanyNameByUserId/${creatorId}`,
          headers
        )
        .then((response) => {
          handleEnterpriseClick(response.data["companyName"], {
            entrepriseName: response.data["companyName"],
            picture: response.data["picture"],
            sentAt: response.data["sentAt"],
            unreadCount: response.data["unreadCount"],
          });
        });
    } else if (location.state?.offerId) {
      const offerId = location.state?.offerId;
      const token = localStorage.getItem("token");
      const headers = {
        headers: {
          token: token,
        },
      };
      axios
        .post(`http://localhost:3001/offres/getOffer`, { id: offerId }, headers)
        .then((response) => {
          const creatorId = response.data["offer"]["creator"];
          axios
            .get(
              `http://localhost:3001/users/getCompanyNameByUserId/${creatorId}`,
              headers
            )
            .then((response) => {
              handleEnterpriseClick(response.data["companyName"], {
                entrepriseName: response.data["companyName"],
                picture: response.data["picture"],
                sentAt: response.data["sentAt"],
                unreadCount: response.data["unreadCount"],
              });
            });
        });
    }
  };

  useEffect(() => {
    console.log(companiesInfo);
    updateBadges();
  }, [companiesInfo]);

  useEffect(() => {
    getCompaniesInfo()
      .then((response) => {
        entreprises = response.data;
        setCompaniesInfo(response.data);
        handleLocation();
      })
      .catch((error) => {
        console.error(error);
      });
    getCompanyInfo();
    getUsername();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };
    if (discussion === "") return;
    const data = {
      entrepriseName: discussion,
      content: textAreaInput,
    };
    axios
      .post("http://localhost:3001/messages/newMsg", data, headers)
      .then((res) => {
        const data = res.data;
        setTextAreaInput("");
        socket.emit("newMsg", data);
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) handleSubmit(event);
  };

  return (
    <div class="Container">
      <div class="left">
        <h1 class="titre">Box de négociation</h1>
        <h2
          class="section1"
          onClick={() => {
            navigate(`/Profile/${username.username}`);
          }}
        >
          {" "}
          profile
        </h2>
        {companiesInfo.map((company, index) => {
          if (companyInfo.entrepriseName === company.entrepriseName) {
            return (
              <tr class="main" key={company.entrepriseName}>
                <div className="profile">
                  <th>
                    <img
                      className="pic"
                      src={company.picture}
                      alt={company.entrepriseName}
                    />
                  </th>
                  <th>
                    <p>{company.entrepriseName}</p>
                  </th>
                </div>
              </tr>
            );
          } else return null;
        })}
      </div>
      <div className="center">
        <h1 class="titre">Liste des entreprises</h1>
        <div class="contactbox">
          {companiesInfo.map((company, index) => {
            if (companyInfo.entrepriseName !== company.entrepriseName) {
              return (
                <div
                  key={company._id}
                  className="sections"
                  onClick={() => handleEnterpriseClick(company.entrepriseName)}
                >
                  <Badge
                    badgeContent={chatBadges[company.entrepriseName]}
                    color="error"
                  >
                    <div className="d-flex flex-row align-items-center">
                      <img
                        className="pic"
                        src={company.picture}
                        alt={company.entrepriseName}
                      />
                      <p>{company.entrepriseName}</p>
                    </div>
                  </Badge>
                </div>
              );
            } else return null;
          })}
        </div>
      </div>
      {discussion === "" ? (
        <div className="right" key={discussion}>
          <h1 className="titre">Welcome To Chat</h1>
          <ChatBox
            discussion={discussion}
            setDiscussion={setDiscussion}
            messages={messages}
            setMessages={setMessages}
            chatBadges={chatBadges}
            companyInfo={companyInfo}
            entreprises={companiesInfo}
            setCompaniesInfo={(cmp) => {
              entreprises = [
                { entrepriseName: cmp["companyName"], picture: cmp["picture"] },
                ...entreprises,
              ];
              setCompaniesInfo((prev) => [
                {
                  entrepriseName: cmp["companyName"],
                  picture: cmp["picture"],
                  sentAt: cmp["sentAt"],
                  unreadCount: cmp["unreadCount"],
                },
                ...prev,
              ]);
            }}
            setChatBadges={(badges) => setChatBadges(badges)}
          />
        </div>
      ) : (
        <div className="right" key={discussion}>
          <div className="d-flex justify-content-between align-items-start">
            <h1 className="titre">Discussion</h1>
            {selectedEnterpriseInfo && (
              <div className="d-flex align-items-center" style={{ margin: 0 }}>
                <img
                  className="pic2"
                  src={selectedEnterpriseInfo.picture}
                  alt={selectedEnterpriseInfo.entrepriseName}
                />
                <p className="titre">{selectedEnterpriseInfo.entrepriseName}</p>
              </div>
            )}
          </div>

          <div className="discussion ">
            <div className="mgs">
              <ChatBox
                discussion={discussion}
                setDiscussion={setDiscussion}
                messages={messages}
                setMessages={setMessages}
                chatBadges={chatBadges}
                companyInfo={companyInfo}
                entreprises={companiesInfo}
                setCompaniesInfo={(cmp) => {
                  entreprises = [
                    {
                      entrepriseName: cmp["companyName"],
                      picture: cmp["picture"],
                    },
                    ...entreprises,
                  ];
                  setCompaniesInfo((prev) => [
                    {
                      entrepriseName: cmp["companyName"],
                      picture: cmp["picture"],
                      sentAt: cmp["sentAt"],
                      unreadCount: cmp["unreadCount"],
                    },
                    ...prev,
                  ]);
                }}
                setChatBadges={(badges) => setChatBadges(badges)}
              />
            </div>
            <div className="chat-box">
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="d-flex justify-content-center align-items-end"
                style={{ gap: 10 }}
              >
                <TextareaAutosize
                  required
                  className="form-control"
                  minRows={1}
                  maxRows={6}
                  placeholder="Type a message"
                  ref={textAreaRef}
                  style={{ resize: "none", padding: 13 }}
                  value={textAreaInput}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onChange={(e) => {
                    return setTextAreaInput(e.currentTarget.value);
                  }}
                />
                <button className="send-btn">
                  Send
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
