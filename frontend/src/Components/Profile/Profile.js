/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import UserProfile from "../Userprofile/UserProfile";
import AddPost from "../Addpost/AddPost";
import Feeds from "../Feeds/Feeds";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Api/api";

export default function Profile() {
  const token = useSelector((state) => state.auth.token);
  const [feeds,setFeeds] = useState([])
  const navigate = useNavigate();
  const userId = useSelector((state)=>state.auth.user?.user?.id)
  console.log("USER:",userId)


  const updateFeed = useCallback((newPost) => {
    console.log('Before update:', feeds);
    setFeeds((currentFeeds) => {
      const updatedFeeds = [newPost, ...currentFeeds];
      console.log('After update:', updatedFeeds);
      return updatedFeeds;
    });
  }, [feeds]); 
  
  
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      
      const fetchInitialPosts = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/posts/${userId}/`);
          if (response.data) {
            setFeeds(response.data);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
      fetchInitialPosts();
    }
  }, [token, navigate, userId]);

  const removePostFromFeed = useCallback((deletedPostId) => {
    setFeeds((currentFeeds) => currentFeeds.filter(post => post.id !== deletedPostId));
  }, []);
 

  const editPost = useCallback((updatedPost)=>{
    setFeeds((currentFeeds) =>
      currentFeeds.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ))
  },[])
  

  return (
    <>
      <UserProfile />
      <AddPost onNewPost={updateFeed}/>
      <Feeds feeds = {feeds} onRemovePost={removePostFromFeed} onEditPost={editPost}/>
    </>
  );
}
