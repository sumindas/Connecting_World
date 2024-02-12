import React, { useState } from "react";
import "./addpost.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage, faVideo,
} from "@fortawesome/free-solid-svg-icons";
import data from '@emoji-mart/data'
import { Picker } from "emoji-mart";
import axios from "axios";
import { BASE_URL } from "../../Api/api";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../Redux/Slice/postSlice";

export default function AddPost({ onNewPost }) {
  const [content, setContent] = useState("");
  const [videos,setVideos] = useState([])
  const [images, setImages] = useState([]);
  const [showEmojiPicker,setShowEmojiPicker] = useState(false)
  const dispatch = useDispatch();
  const CurrentUserData = useSelector((state) => state.auth.user);
  const userId = CurrentUserData?.user?.id
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);

    videos.forEach((video,index)=>{
      formData.append(`videos[${index}]`,video)
    })
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      formData.append("user", userId);
      const response =  await axios.post(`${BASE_URL}/addpost/${userId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response)
        onNewPost(response.data)
        setContent("");
        setVideos([]);
        setImages([]);
        dispatch(addPost({ userId, post : response.data }));
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setContent(content + emoji.native);
  };

  return (
    <form className="postForm" onSubmit={handleSubmit}>
      <div className="user form-top">
        {CurrentUserData &&
        CurrentUserData.user_profile &&
        CurrentUserData.user_profile.profile_image ? (
          <img
            src={`${BASE_URL}${CurrentUserData.user_profile.profile_image}`}
            alt=""
          />
        ) : null}

        <input
          type="text"
          placeholder="What's on your mind"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setShowEmojiPicker(false)}
        />
        <span
        role="img"
        aria-label="emoji-picker"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        style={{ cursor: 'pointer' }}
      >
        😀
      </span>
      {showEmojiPicker && (
        <div style={{ position: 'absolute', zIndex: '1' }}>
          <Picker onSelect={handleEmojiSelect} />
        </div>
      )}
        <button type="submit" className="btn btn-primary">
          Post
        </button>
      </div>
      <div className="post-categories">
        <label htmlFor="images">
          <input
            type="file"
            id="images"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
          />

          <span>
            <FontAwesomeIcon icon={faImage} />
            Photos
          </span>
        </label>
        <label htmlFor="videos">
          <input
            type="file"
            id="videos"
            multiple
            onChange={(e) => setVideos(Array.from(e.target.files))}
          />

          <span>
            <FontAwesomeIcon icon={faVideo} />
            Videos
          </span>
        </label>
        
      </div>
    </form>
  );
}
