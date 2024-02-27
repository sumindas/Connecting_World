/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import "./leftbar.css";
import { Link } from "react-router-dom";

//Icons images.............
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Api/api";
import Message from "../Message/Message";


export default function LeftBar() {
  const CurrentUser = useSelector((state) => state.auth.user);
  
  return (
    <div className="leftBar">
      <div className="left-container">
        <div className="menu">
          <Link to="/home/profile">
            <div
              style={{ marginBottom: "10px", marginLeft: "10px" }}
              className="user"
            >
              {CurrentUser && CurrentUser.user_profile ? (
                <img
                  src={`${BASE_URL}${CurrentUser.user_profile.profile_image}`}
                  alt="Profile Image"
                  className="profile-image" 
                />
              ) : null}
              
                { CurrentUser && CurrentUser.user && CurrentUser.user.username?(
                 <h4 style={{ marginLeft: "10px" }}> {CurrentUser.user.username}</h4>
                ):null}
              
            </div>
          </Link>
          <Message />
        </div>
      </div>
    </div>
  );
}
