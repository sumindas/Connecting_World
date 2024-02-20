import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatbox.css';

import Stories from '../Stories/Stories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faFileAlt, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../Api/api';

export default function ChatBox() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

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
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  
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
          <form action="">
            <input type="text" placeholder='Write Something' />
            <button type='submit' className='btn btn-primary'>
              <FontAwesomeIcon icon={faArrowCircleRight} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
