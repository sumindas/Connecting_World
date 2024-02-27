import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faVideo } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../Api/api";
import { useSelector } from "react-redux";

import "./chatbox.css";

export default function ChatBox() {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/userprofile/${id}/`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/chat/user/${id}/${userId}/messages/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const initializeWebSocket = () => {
      if (
        !socketRef.current ||
        socketRef.current.readyState === WebSocket.CLOSED
      ) {
        socketRef.current = new WebSocket(
          `ws://localhost:8000/ws/chat/${id}/?token=${token}`
        );

        socketRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.message) {
              setMessages((prevMessages) => [...prevMessages, data.message]);
            } else {
              console.error("Unexpected message format:", data);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message data:", error);
          }
        };

        socketRef.current.onerror = (error) => {
          setErrorMessage("WebSocket error: " + error.message);
          console.error("WebSocket error:", error);
        };

        socketRef.current.onclose = (event) => {
          console.log("WebSocket connection closed:", event);
          setTimeout(initializeWebSocket, 5000);
        };
      }
    };

    fetchUser();
    fetchMessages().then(() => initializeWebSocket());

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [id, token, userId]);

  const sendMessage = (event) => {
    event.preventDefault();

    const message = newMessage.trim();

    if (message === "") {
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageData = JSON.stringify({
        message: message,
      });
      socketRef.current.send(messageData);
      setNewMessage("");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const profileImage = user?.userprofile?.profile_image;
  const fullName = user?.full_name;
  const username = user?.username;

  return (
    <div className="chat-box">
      <div className="chat-box-top">
        <img src={profileImage || ""} alt={fullName || ""} />
        <div className="user-name">
          <h3>{fullName || ""}</h3>
          <h5>{username || ""}</h5>
        </div>
        <div className="call-icons">
          <label className="btn btn-primary" htmlFor="CFile">
            <FontAwesomeIcon icon={faVideo} />
          </label>
        </div>
      </div>
      <div className="chat-box-bottom">
        <div className="messages flex flex-col-reverse space-y-reverse space-y-4 overflow-y-auto">
          {messages.map((message) => {
            if (typeof message === "object" && message.id && message.content) {
              return (
                <p
                  key={message.id}
                  className={`p-2 rounded-lg max-w-xs ${
                    message.user?.id == userId
                      ? "bg-blue-500 text-white self-end"
                      : "bg-white text-black self-start"
                  }`}
                >
                  {message.content}
                </p>
              );
            }
            return null; // or handle unexpected data differently
          })}
        </div>
        <form
          style={{ marginTop: "20px" }}
          className="new-message-form"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            placeholder="Write Something"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendMessage(event);
              }
            }}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
          >
            <FontAwesomeIcon icon={faArrowCircleRight} className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
}
