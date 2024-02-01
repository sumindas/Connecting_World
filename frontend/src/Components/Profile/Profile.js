/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { UseSelector, useSelector } from "react-redux";

import UserProfile from "../Userprofile/UserProfile";
import AddPost from "../Addpost/AddPost";
import Feeds from "../Feeds/Feeds";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const token = useSelector((state) => state.auth.token);
  const profileState = useSelector((state) => state.profile);
  console.log(("Profile:", profileState));
  console.log("Token:", token);
  const navigate = useNavigate();

  useEffect (()=>{
    if(!token){
      navigate('/')
    }
  })

  return (
    <>
      <UserProfile />
      <AddPost />
      {/* <Feeds /> */}
    </>
  );
}
