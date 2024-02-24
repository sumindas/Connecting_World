import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./chatbox.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleRight,
  faFileAlt,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../Api/api";
import { useSelector } from "react-redux";

export default function ChatBox() {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const CurrentUser = useSelector((state) => state.auth.user);
  const userId = CurrentUser?.user?.id;
  const token = localStorage.getItem("token");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log("Messages state updated:", messages);
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
        console.log("Messages:", response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchUser();
    fetchMessages();
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
              console.log("new", data.message);
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

    initializeWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [id, token, userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

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
      console.log("Message sent:", messageData);
      setNewMessage("");
    }
  };
  console.log("object", messages);
  const profileImage = user?.userprofile?.profile_image;
  const fullName = user?.full_name;
  const username = user?.username;

  return (
    <>
      <div className="chat-box">
        <div className="chat-box-top">
          <img src={profileImage || ""} alt={fullName || ""} />
          <div className="user-name">
            <h3>{fullName || ""}</h3>
            <h5>{username || ""}</h5>
          </div>
          {/* <div className="call-icons">
            <label className='btn btn-primary' htmlFor="CFile">
              <FontAwesomeIcon icon={faVideo} />
            </label>
            <label className='btn btn-primary' htmlFor="CFile">
              <FontAwesomeIcon icon={faPhone} />
            </label>
          </div> */}
        </div>
        <div className="chat-box-bottom">
          <div className="messages flex flex-col-reverse space-y-reverse space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <p
                key={message.id}
                className={`p-2 rounded-lg max-w-xs ${
                  message.user?.id === userId
                    ? "bg-green-200 self-end"
                    : "bg-white self-start"
                }`}
              >
                {message.content}{" "}
              </p>
            ))}
          </div>
          <form className="new-message-form" onSubmit={sendMessage}>
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
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faArrowCircleRight} />
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
