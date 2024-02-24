/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

//Static............
import CurrentUser from "../../FackApis/CurrentUserData";

//Fontawesome Icon........
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faSearch,
  faEnvelope,
  faBell,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import DarkMode from "../Darkmode/DarkMode";
import { BASE_URL } from "../../Api/api";
import { useSelector } from "react-redux";
import axios from "axios";
import { useRef } from "react";

export default function NavBar() {
  const CurrentUser = useSelector((state) => state.auth.user);
  const [username, setUsername] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionListRef = useRef(null);
  const CurrentUserName = CurrentUser?.user?.username;
  const userId = CurrentUser?.user?.id

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionListRef.current &&
        !suggestionListRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/search/`, {
        params: { username },
      });
      console.log("users:", response.data);
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <nav>
      <div className="nav-container">
        {/* ............Nav Area Left............... */}
        <div className="nav-left">
          <Link to="/">
            <h3 className="logo">
              <strong>Connecting World</strong>
            </h3>
          </Link>
          <Link to="/home">
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <Link to="/home/profile">
            <FontAwesomeIcon icon={faUser} />
          </Link>
          <div className="Nav-Searchbar">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Search for users..."
            />
            <FontAwesomeIcon onClick={handleSearch} icon={faSearch} />
          </div>
          
            {showSuggestions && (
              <div className="Nav-Searchbar">
              <ul
                ref={suggestionListRef}
                style={{ width: "250px" }}
                className="suggestion-list"
              >
                {suggestions.length > 0 ? (
                  suggestions.map((user) => (
                    <li key={user.id}>
                      <Link
                        to={
                          user?.username === CurrentUserName
                            ? "/home/profile"
                            : `/home/user/${user.id}`
                        }
                      >
                        <span>{user.username}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="no-suggestions">No users found</li>
                )}
              </ul>
              </div>
            )}
          </div>
        

        {/* ............Nav Area Right............... */}

        <div className="nav-right">
          
          <Link to={`/home/notificatins/${userId}`}>
            <FontAwesomeIcon icon={faBell} />
          </Link>
          <DarkMode />
          <div className="user">
            {CurrentUser && CurrentUser.user_profile ? (
              <img
                src={`${BASE_URL}${CurrentUser.user_profile.profile_image}`}
                alt="Profile Image"
                className="profile-image" 
              />
            ) : null}
            <h4 style={{ marginLeft: "10px" }}>
              {CurrentUser?.user?.username}
            </h4>
            {/* Add other user details here as needed */}
          </div>
        </div>
      </div>
    </nav>
  );
}
