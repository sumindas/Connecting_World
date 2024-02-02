import React, { useState } from "react";
import "./addpost.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faSmile,
  faTags,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { BASE_URL } from "../../Api/api";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../Redux/Slice/postSlice";

export default function AddPost() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState(""); // Add location state
  const [feelings, setFeelings] = useState("");
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const CurrentUserData = useSelector((state) => state.auth.user);
  const userProfile = CurrentUserData?.user_profile;
  console.log("userProfile", userProfile);

  const profileImage = userProfile?.profile_image;
  console.log("Image:", profileImage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("location", location); // Add location to the form data
    formData.append("feelings", feelings);
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const response = await axios.post(`${BASE_URL}/addpost/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(addPost(response.data));
    } catch (error) {
      console.error("Error creating post:", error);
    }
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
        />
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
        <input
          type="text"
          placeholder="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          type="text"
          placeholder="Feelings"
          value={feelings}
          onChange={(e) => setFeelings(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </form>
  );
}
