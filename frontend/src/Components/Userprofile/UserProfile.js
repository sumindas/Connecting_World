/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './userprofile.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeed, faLink, faMessage } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../Api/api';

export default function UserProfile() {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);
    const token = useSelector((state)=>state.auth.token)
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/userdata/${currentUser.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    
                });
                console.log("Response:",response)
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/');
            }
        };

        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser, token]);

    if (!currentUser || !userData) {
        return null; 
    }

    return (
        <div className='userProfile'>
            <div className="cover-photos">
                <img src={userData.CoverPhoto} alt="" />
            </div>
            <div className="profile-info">
                <img src={userData.ProfieImage} alt="" />
                <div className="user-name">
                    <h3>{currentUser.email}</h3>
                    <h5>{userData.username}</h5>
                </div>
                <div className="profile-button">
                    <Link to='/chat/id'>
                        <button className='btn btn-primary'>
                            <FontAwesomeIcon icon={faMessage} />
                        </button>
                    </Link>
                    <button className="btn btn-primary">
                        <FontAwesomeIcon icon={faFeed} />Follow me
                    </button>
                    <button className="btn btn-primary">
                        <FontAwesomeIcon icon={faLink} />Follow me
                    </button>
                </div>
                <p className='bio'>
                    {userData.bio}
                </p>
            </div>
        </div>
    );
}
