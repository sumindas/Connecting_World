/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { BASE_URL } from "../../Api/api";
import { useSelector } from "react-redux";
import CommentsList from "../Comments/Comments";

const FeedItem = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  console.log("=====",post)
  const userId = localStorage.getItem('userId')
  const [showComments, setShowComments] = useState(false);




  useEffect(() => {
    const fetchLikeAndCommentInfo = async () => {
      try {
        const likeResponse = await axios.get(`${BASE_URL}/likes/`, {
          params: {
            postId: post.id,
            userId: userId,
          },
        });

        setLikeCount(likeResponse.data.count);
        setLiked(likeResponse.data.likedByUser);

        const commentResponse = await axios.get(
          `${BASE_URL}/posts/${post.id}/comments/`
        );
        setCommentCount(commentResponse.data.length);
      } catch (error) {
        console.error("Error fetching like and comment info:", error);
      }
    };

    fetchLikeAndCommentInfo();
  }, [post, userId]);

  const handleLikeClick = async () => {
    setLiked(!liked);
    try {
      const response = await axios.post(`${BASE_URL}/likes/`, {
        postId: post.id,
        userId: userId,
      });
      if (
        response.data.message === "Like created." ||
        response.data.message === "Like already exists."
      ) {
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  const toggleCommentsVisibility = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 my-4">
      {/* User Profile Section */}
      <div className="flex items-center">
        {post.user && post.user.userprofile.profile_image && (
          <img
            src={post.user.userprofile.profile_image}
            alt={`Profile image of ${post.user.username}`}
            className="w-10 h-10 rounded-full mr-4" // Adjust the size and styling as needed
          />
        )}
        {post.user && (
          <p className="font-bold text-lg">{post.user.username}</p>
        )}
      </div>
  
      <h2 className="font-bold text-xl mt-4 mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
  
      {/* Render images and videos */}
      <div className="media">
        {/* Display Images */}
        {post.images &&
          post.images.length >  0 &&
          post.images.map((imageObj, index) => (
            <img
              key={index}
              src={imageObj.images_url}
              alt={`Image ${index}`}
              className="media-item"
            />
          ))}
  
        {/* Display Videos */}
        {post.videos &&
          post.videos.length >  0 &&
          post.videos.map((videoObj, index) => (
            <video key={index} controls className="media-item">
              <source
                src={videoObj.video_url}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ))}
      </div>
  
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <button
            onClick={handleLikeClick}
            className={`mr-2 px-3 py-1 text-sm font-semibold rounded ${
              liked ? "text-red-500" : "text-gray-700"
            } hover:text-red-500`}
          >
            <FontAwesomeIcon icon={faHeart} /> {likeCount}
          </button>
          <button
            onClick={toggleCommentsVisibility}
            className="px-3 py-1 text-sm font-semibold rounded text-gray-700 hover:text-gray-500"
          >
            <FontAwesomeIcon icon={faComment} /> {commentCount}
          </button>
        </div>
      </div>
      {showComments && <CommentsList post={post} />}

    </div>
  );
  
};

export default FeedItem;
