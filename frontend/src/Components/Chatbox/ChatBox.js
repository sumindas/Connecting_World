import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './chatbox.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faFileAlt, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../Api/api';
import { useSelector } from 'react-redux';

export default function ChatBox() {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const CurrentUser = useSelector((state)=>state.auth.user)
  const userId = CurrentUser?.user?.id
  const token = useSelector((state)=>state.auth.token)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/userprofile/${id}/`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();

    socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${id}/?token=${token}`);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    return () => {
      socketRef.current.close();
    };
  }, [id, token, userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      socketRef.current.send(JSON.stringify({ message: newMessage }));
      setNewMessage('');
    }
  };

  const profileImage = user?.userprofile?.profile_image;
  const fullName = user?.full_name;
  const username = user?.username;

  return (
    <>
      <div className="chat-box">
        <div className="chat-box-top">
          {/* Check if profileImage exists before setting the src attribute */}
          <img src={profileImage || ''} alt={fullName || ''} />
          <div className="user-name">
            <h3>{fullName || ''}</h3>
            <h5>{username || ''}</h5>
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
          <form className="new-message-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder='Write Something'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className='btn btn-primary'>
              <FontAwesomeIcon icon={faArrowCircleRight} />
              Send
            </button>
          </form>
          <div className="messages">
            {messages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
