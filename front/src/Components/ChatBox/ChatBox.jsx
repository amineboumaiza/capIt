import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../../socketProvider";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import notifSound from "../../audio/notifications-sound-127856 (mp3cut.net).mp3";
import "./ChatBox.css";

const playMessageSound = () => {
  const audio = new Audio(notifSound);
  audio.play();
};

export default function ChatBox({
  entreprises: companiesInfo,
  setCompaniesInfo,
  companyInfo,
  discussion,
  setDiscussion,
  messages,
  setMessages,
  chatBadges,
  setChatBadges,
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [onceFlag, setOnceFlag] = useState(0);
  const socket = useSocket();
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMoreData = async () => {
    setLoading(true);

    await delay(1000);
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };
    const response = await axios.get(
      `http://localhost:3001/messages/t/${discussion}?page=${pageNumber}`,
      headers
    );
    console.log(response["data"]["messages"]);
    setMessages((prev) => [...response["data"]["messages"].reverse(), ...prev]);
    setPageNumber((prev) => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    let isAborted = false;
    const onMount = async () => {
      setLoading(true);
      setMessages([]);

      await delay(1000);
      const token = localStorage.getItem("token");
      const headers = {
        headers: {
          token: token,
        },
      };

      let msgs = [];

      if (discussion === "") return setMessages([]);
      const res = await axios.get(
        `http://localhost:3001/messages/t/${discussion}`,
        headers
      );

      msgs = res.data["messages"].reverse();
      if (isAborted) return;
      setMessages([...msgs]);
      setOnceFlag(1);
      setLoading(false);
    };
    onMount();
    return () => {
      setMessages([]);
      setLoading(false);
      isAborted = true;
    };
  }, [discussion]);

  useEffect(() => {
    const asyncfun = async () => {
      if (chatBadges[discussion] > 0) {
        const token = localStorage.getItem("token");
        const headers = {
          headers: {
            token: token,
          },
        };

        await axios.get(
          `http://localhost:3001/messages/updateRead/${discussion}`,
          headers
        );
        const badges = { ...chatBadges };
        badges[discussion] = 0;
        setChatBadges(badges);
      }
    };
    asyncfun();
  }, [chatBadges]);

  useEffect(() => {
    scrollToBottom();
  }, [onceFlag]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("newMessage", ({ newMsg }) => {
      if (
        discussion === newMsg.receiver.entrepriseName ||
        discussion === newMsg.sender.entrepriseName
      ) {
        if (companyInfo.entrepriseName === newMsg.receiver.entrepriseName) {
          newMsg["read"] = true;
          const token = localStorage.getItem("token");
          const headers = {
            headers: {
              token: token,
            },
          };
          axios.get(
            `http://localhost:3001/messages/updateRead/${discussion}`,
            headers
          );
        }

        setMessages((prev) => {
          return [...prev, newMsg];
        });
      } else {
        if (newMsg.receiver.entrepriseName === companyInfo.entrepriseName) {
          const companyFound = companiesInfo.find((cmp) => {
            return cmp.entrepriseName === newMsg.sender.entrepriseName;
          });
          if (!companyFound) {
            const getCompany = async () => {
              const token = localStorage.getItem("token");
              const headers = {
                headers: {
                  token: token,
                },
              };

              const response = await axios.get(
                `http://localhost:3001/users/getCompanyNameByUserId/${newMsg.sender._id}`,
                headers
              );
              setCompaniesInfo(response.data);
            };
            getCompany();
          } else {
            const badges = { ...chatBadges };
            console.log(badges);
            if (typeof badges[newMsg.sender.entrepriseName] !== "undefined")
              badges[newMsg.sender.entrepriseName] += 1;
            else badges[newMsg.sender.entrepriseName] = 1;
            console.log(badges);

            setChatBadges({ ...badges });
          }

          playMessageSound();
        }
      }
    });

    return () => socket.off("newMessage");
  }, [
    socket,
    chatBadges,
    companiesInfo,
    companyInfo.entrepriseName,
    discussion,
  ]);

  return (
    <>
      {discussion !== "" && (
        <div
          id="diver"
          className="messages"
          ref={messagesTopRef}
          onScroll={() => {
            if (messagesTopRef.current.scrollTop === 0 && !loading) {
              fetchMoreData();
            }
          }}
        >
          <div
            display={loading}
            style={{
              alignSelf: "center",
              margin: "10px auto",
            }}
          >
            <ClipLoader
              color={"#AF07E6"}
              loading={loading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>

          {messages?.map((message) => {
            if (discussion === message.sender.entrepriseName) {
              return (
                <p key={message._id} className="sender message-text">
                  {message.content}
                </p>
              );
            } else {
              return (
                <p key={message._id} className="reciever message-text">
                  {message.content}
                </p>
              );
            }
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </>
  );
}
