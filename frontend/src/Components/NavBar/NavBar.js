/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from "react";
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

export default function NavBar() {
  const CurrentUser = useSelector((state) => state.auth.user);

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
          <Link to="/">
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <Link to="/home/profile/id">
            <FontAwesomeIcon icon={faUser} />
          </Link>
          <div className="Nav-Searchbar">
            <FontAwesomeIcon icon={faSearch} />
            <input type="search" />
          </div>
        </div>

        {/* ............Nav Area Right............... */}

        <div className="nav-right">
          <Link to="/home/chat/id">
            <FontAwesomeIcon icon={faEnvelope} />
          </Link>
          <Link to="/">
            <FontAwesomeIcon icon={faBell} />
          </Link>
          <DarkMode />
          <Link to="/">
            <FontAwesomeIcon icon={faBars} />
          </Link>
          <div className="user">
            {CurrentUser && CurrentUser.user_profile ? (
              <img
                src={`${BASE_URL}${CurrentUser.user_profile.profile_image}`}
                alt="Profile Image"
                className="profile-image" // Add a class for styling if needed
              />
            ) : null}
            <h4 style={{ marginLeft: "10px" }}>{CurrentUser?.user?.username}</h4>
            {/* Add other user details here as needed */}
          </div>
        </div>
      </div>
    </nav>
  );
}
