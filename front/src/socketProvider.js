import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    const url = "http://localhost:3001/users/getUserId";
    const token = localStorage.getItem("token");

    const headers = {
      headers: {
        token: token,
      },
    };

    let newSocket;
    axios.get(url, headers).then((res) => {
      newSocket = io("http://localhost:5000", {
        query: { id: res.data.user._id },
      });
      setSocket(newSocket);
      console.log("new socket :");
      console.log(newSocket);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
