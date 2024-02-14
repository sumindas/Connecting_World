import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../Api/api';
import { useSelector } from 'react-redux';

function CommentsList({ post }) {
  const [comments, setComments] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);
  const postId = post.id
  const userId = post.user.id
 

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts/${post.id}/comments/`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [post.id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const commentText = e.target.comment.value;

    try {
        const response = await axios.post(
          `${BASE_URL}/posts/${postId}/comments/create/${userId}/`,
          { content: commentText },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      setComments((prevComments) => [...prevComments, response.data]);
      e.target.reset()
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  


  return (
    <div className="w-full bg-white p-4 rounded-lg flex flex-col gap-4 m-4">
  <div className="writebox">
    <form onSubmit={handleCommentSubmit} className="flex flex-col">
      <div className="flex items-center">
        {currentUser && currentUser.user_profile ? (
          <img
            src={`${BASE_URL}${currentUser.user_profile.profile_image}`}
            alt=""
            className="rounded-full w-10 h-10 mr-4"
          />
        ) : null}
        <input
          type="text"
          name="comment"
          placeholder="Write a comment"
          className="flex-grow py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="ml-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Comment
        </button>
      </div>
    </form>
  </div>
  {comments.length ===  0 ? (
    <p className="text-center">No comments yet.</p>
  ) : (
    comments.map((comment) => (
      <div key={comment.id} className="flex flex-col">
        <img className="rounded-full w-10 h-10" src={comment.user.userprofile.profile_image} alt="" />
        <h5 className="font-semibold">{comment.user.username}</h5>
        <p className="text-base">{comment.content}</p>
      </div>
    ))
  )}
</div>
  );
}

export default CommentsList;
