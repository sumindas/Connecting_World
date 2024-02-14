/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faFeed } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const OtherUser = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const CurrentUser = useSelector((state)=>state.auth.user)
  const userId = CurrentUser?.user?.id

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/userprofile/${id}/`);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/following/${userId}/`,
        { followed: id },
      );
      setIsFollowing(!isFollowing);
      alert(response.data.message);
    } catch (error) {
      console.error('Error following user:', error);
      alert('Failed to follow user. Please try again later.');
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="userProfile">
      <div className="cover-photos">
        <img src={userProfile.userprofile.cover_photo} alt="Cover Photo" />
      </div>
      <div className="profile-info">
        <img src={userProfile.userprofile.profile_image} alt="Profile Photo" />
        <div className="user-name">
          <h5>{userProfile.username}</h5>
          <div className="user-location">
            <h5>{userProfile.userprofile.location}</h5>
          </div>
          <div>
            <p className="bio">
              {userProfile.userprofile.bio}
            </p>
          </div>
        </div>
        <div className="profile-button">
          <Link to={`/chat/${id}`}>
            <button className="btn btn-primary">
              <FontAwesomeIcon icon={faMessage} />
            </button>
          </Link>
          <button className="btn btn-primary" onClick={handleFollow}>
            <FontAwesomeIcon icon={faFeed} />
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherUser;
