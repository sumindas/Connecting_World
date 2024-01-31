import React, { useEffect, useState } from 'react';
import './userprofile.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFeed, faLink, faMessage, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../../Api/api';
import { setUserProfile } from '../../Redux/Slice/profileSlice';
import axios from 'axios';
import { setUser,userLogout } from '../../Redux/Slice/authSlice';


export default function UserProfile() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate()
    console.log("CurrentUser:",currentUser)

    useEffect(() => {
        axios
          .get(`${BASE_URL}/userdata/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          })
          .then(response => {
            const userData = response.data;
            console.log("Userdata:", userData);
            setUserData(userData);
            dispatch(setUser(userData));
          })
          .catch(error => {
            console.log('Error fetching user data:', error);
          });
      }, [token, dispatch]);

    const [formData,setFormData] = useState({
        bio :'',
        date_of_birth: '',
        location : '',
        phone : '',
        profile_image : null,
        cover_photo : null,
    })

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]:event.target.value,
        })
    }
 

    const handleFileChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.files[0],
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        
        const formData = new FormData()
        for (let key in this.state.formData){
        formData.append(key,this.state.formData[key])
        }

        axios.put(`${BASE_URL}/profileupdate/`,formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        })
        .then(response => {
            console.log("Profile Updated SuccesFully")
        })
        .catch(error => {
            console.log("Error Updating Profile:",error)
        })
    }

    const handleLogout = (e)=>{
        dispatch(userLogout)
        console.log("Success")
        navigate('/')
    }

    
    
    const isOwnProfile = currentUser && userData && currentUser.user.id === userData.user.id;
    return (
        <div className='userProfile'>
        <div className="cover-photos">
          {currentUser && currentUser.user_profile && currentUser.user_profile.cover_photo ? 
            <img src={`${BASE_URL}${currentUser.user_profile.cover_photo}`} alt="" /> : 
            <input type="file" id="file-input" name="cover_photo" />
          }
        </div> 
        <div className="profile-info">
          {currentUser && currentUser.user_profile && currentUser.user_profile.profile_image ? 
            <img src={`${BASE_URL}${currentUser.user_profile.profile_image}`} alt="" /> :
            <input type="file" id="file-input" name="profile_image" />
          }
          
          <div className="user-name">
            {currentUser && currentUser.user && currentUser.user.username ? 
              <h5>{currentUser.user.username}</h5> : 
              <input type="text" placeholder="Update username" />
            }
            <div className="user-location">
            {currentUser && currentUser.user_profile && currentUser.user_profile.location ? 
              <h5>{currentUser.user_profile.location}</h5> : 
              <input type="text" placeholder="Update location" />
            }
            </div>
          </div>
  
          <div className="profile-button">
            <Link to='/chat/id'>
              <button className='btn btn-primary'>
                <FontAwesomeIcon icon={faMessage} />
              </button>
            </Link>
            {isOwnProfile ? null : (
                        <button className="btn btn-primary">
                            <FontAwesomeIcon icon={faFeed} />Follow me
                        </button>
                    )}
            <button className="btn btn-primary">
              <FontAwesomeIcon icon={faEdit} />Update Profile
            </button>
            <button className="btn btn-primary"onClick={(e) => handleLogout(e)} >
                        <FontAwesomeIcon icon={faSignOut}  />Logout
            </button>
          </div>
          <p className='bio'>
            {userData && userData.user_profile && userData.user_profile.bio ? 
              userData.user_profile.bio : 
              <input type="text" placeholder="Update bio" />
            }
          </p>
        </div>
      </div>
    );
  }