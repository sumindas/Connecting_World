/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, Fragment } from "react";
import "./userprofile.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faFeed,
  faMessage,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../Api/api";
import axios from "axios";
import { setUser, userLogout } from "../../Redux/Slice/authSlice";
import { Transition, Dialog } from "@headlessui/react";

export default function UserProfile() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(userData?.user?.username || "");
  const [location, setLocation] = useState(
    userData?.user_profile?.location || ""
  );
  const [bio, setBio] = useState(userData?.user_profile?.bio || "");
  const [dob, setDob] = useState(userData?.user_profile?.date_of_birth || "");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [userProfileId,setuserProfileId] = useState()

  useEffect(() => {
    if(token){
      axios
      .get(`${BASE_URL}/userdata/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        const userData = response.data;
        setUserData(userData);
        dispatch(setUser(userData));
        setuserProfileId(userData.user.id)
        setUsername(userData?.user?.username || "");
        setLocation(userData?.user_profile?.location || "");
        setBio(userData?.user_profile?.bio || "");
        setDob(userData?.user_profile?.date_of_birth || "");
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
    } else{
      navigate('/')
    }
  }, [token, dispatch,navigate]);

  
  console.log("---",userProfileId)


  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogout = (e) => {
    dispatch(userLogout());
    console.log("Success");
    navigate("/");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form")
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('location', location);
    formData.append('bio', bio);
    formData.append('date_of_birth', dob);
    if (profilePhoto) {
       formData.append('profile_photo', profilePhoto);
    }
    if (coverPhoto) {
       formData.append('cover_photo', coverPhoto);
    }
   
    try {
       // Use Axios to send the POST request
       const response = await axios.post(`http://127.0.0.1:8000/userupdate/${userProfileId}/`, formData, {
         headers: {
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'multipart/form-data', 
         },
         withCredentials: true,
       });
   
       console.log(response.data);
  
       const updatedUserDataResponse = await axios.get(`${BASE_URL}/userdata/`, {
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
         withCredentials: true,
       });
   
       const updatedUserData = updatedUserDataResponse.data;
   
       setUserData(updatedUserData);
       dispatch(setUser(updatedUserData));
       setuserProfileId(updatedUserData.user_profile.id);
       setUsername(updatedUserData?.user?.username || "");
       setLocation(updatedUserData?.user_profile?.location || "");
       setBio(updatedUserData?.user_profile?.bio || "");
       setDob(updatedUserData?.user_profile?.date_of_birth || "");
   
       closeModal();
    } catch (error) {
       console.error('There has been a problem with your Axios operation:', error);
    }
   };
   

  const isOwnProfile =
    currentUser && userData && currentUser.user.id === userData.user.id;

  return (
    <div className="userProfile">
      <div className="cover-photos">
        {currentUser &&
        currentUser.user_profile &&
        currentUser.user_profile.cover_photo ? (
          <img
            src={`${BASE_URL}${currentUser.user_profile.cover_photo}`}
            alt=""
          />
        ) : (
          <img src="" alt="No cover Photo" />
      
        )}
      </div>
      <div className="profile-info">
        {currentUser &&
        currentUser.user_profile &&
        currentUser.user_profile.profile_image ? (
          <img
            src={`${BASE_URL}${currentUser.user_profile.profile_image}`}
            alt=""
          />
        ) : (
          <img src="" alt="No Profile Photo" />
        )}

        <div className="user-name">
          {currentUser && currentUser.user && currentUser.user.username ? (
            <h5>{currentUser.user.username}</h5>
          ) : (
            <input type="text" placeholder="Update username" />
          )}
          <div className="user-location">
            {currentUser &&
            currentUser.user_profile &&
            currentUser.user_profile.location ? (
              <h5>{currentUser.user_profile.location}</h5>
            ) : (
              <input type="text" placeholder="Update location" />
            )}
          </div>
        </div>

        <div className="profile-button">
          <Link to="/chat/id">
            <button className="btn btn-primary">
              <FontAwesomeIcon icon={faMessage} />
            </button>
          </Link>
          {isOwnProfile ? null : (
            <button className="btn btn-primary">
              <FontAwesomeIcon icon={faFeed} />
              Follow me
            </button>
          )}
          <button className="btn btn-primary" onClick={openModal}>
            <FontAwesomeIcon icon={faEdit} />
            Update Profile
          </button>
          <Transition show={isOpen} as={React.Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={closeModal}
            >
              <div className="min-h-screen px-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                </Transition.Child>

                {/* Your existing modal content */}
                <Transition.Child
                  as={React.Fragment}
                  enter="transform transition ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transform transition ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Update Profile
                    </Dialog.Title>

                    <div className="mt-2">
                      <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                        {/* Add other form fields */}
                        <div className="mb-4">
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="bio"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bio
                          </label>
                          <textarea
                            name="bio"
                            id="bio"
                            rows="3"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date of Birth
                          </label>
                          <input
                            type="text"
                            name="date_of_birth"
                            id="dob"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="profilePhoto"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Current Profile Photo
                          </label>
                          {currentUser &&
                          currentUser.user_profile &&
                          currentUser.user_profile.profile_image ? (
                            <>
                              <img
                                src={`${BASE_URL}${currentUser.user_profile.profile_image}`}
                                alt="Current Profile Photo"
                                className="mt-2 rounded-md"
                                style={{ maxWidth: "100%" }}
                              />
                              <p>Click to change:</p>
                            </>
                          ) : (
                            <p>No profile photo available</p>
                          )}
                          <input
                            type="file"
                            name="newProfilePhoto"
                            id="newProfilePhoto"
                            accept="image/*"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            onChange={(e) => setProfilePhoto(e.target.files[0])}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="coverPhoto"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Current Cover Photo
                          </label>
                          {currentUser &&
                          currentUser.user_profile &&
                          currentUser.user_profile.cover_photo ? (
                            <>
                              <img
                                src={`${BASE_URL}${currentUser.user_profile.cover_photo}`}
                                alt="Current Cover Photo"
                                className="mt-2 rounded-md"
                                style={{ maxWidth: "100%" }}
                              />
                              <p>Click to change:</p>
                            </>
                          ) : (
                            <p>No cover photo available</p>
                          )}
                          <input
                            type="file"
                            name="newCoverPhoto"
                            id="newCoverPhoto"
                            accept="image/*"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            onChange={(e) => setCoverPhoto(e.target.files[0])}
                          />
                        </div>

                        <button
                          type="submit"
                          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save Changes
                        </button>
                        <button
                          style={{ marginLeft: "20px" }}
                          onClick={closeModal}
                          type="submit"
                          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Close
                        </button>
                      </form>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>

          <button className="btn btn-primary" onClick={(e) => handleLogout(e)}>
            <FontAwesomeIcon icon={faSignOut} />
            Logout
          </button>
        </div>
        <p className="bio">
          {userData && userData.user_profile && userData.user_profile.bio ? (
            userData.user_profile.bio
          ) : (
            <input type="text" placeholder="Update bio" />
          )}
        </p>
      </div>
    </div>
  );
}
