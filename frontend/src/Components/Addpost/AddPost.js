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
  const [feelings, setFeelings] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("feelings", feelings);
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    videos.forEach((video, index) => {
      formData.append(`videos[${index}]`, video);
    });

    try {
      const response = await axios.post(`${BASE_URL}/post/`, formData, {
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
        {/* <img src={CurrentUserData.map((user) => user.ProfieImage)} alt="" /> */}
        <input
          type="text"
          placeholder="What on your mind"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Post
        </button>
      </div>
      <div className="post-categories">
        <label htmlFor="file">
          <input
            type="file"
            id="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
          <span>
            <FontAwesomeIcon icon={faImage} />
            Photos
          </span>
        </label>
        <label htmlFor="file">
          <input
            type="file"
            id="file"
            multiple
            onChange={(e) => setVideos(e.target.files)}
          />
          <span>
            <FontAwesomeIcon icon={faVideo} />
            Videos
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
      </div>
    </form>
  );
}
