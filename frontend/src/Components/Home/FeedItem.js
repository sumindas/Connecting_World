/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';

const FeedItem = ({ post }) => {
  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4">
      {/* User Information */}
      <div className="flex items-center mb-2">
        <img src={post.user.profile_picture} alt="User Avatar" className="w-10 h-10 rounded-full mr-3" /> 
        <div>
          <h3 className="font-medium">{post.user.username}</h3>
          <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="mb-2">{post.content}</p>

      {/* Optional: Display image if available */}
      {post.image && (
        <img src={post.image} alt="Post Image" className="w-full rounded-md" />
      )}

      {/* Interactions (Like, Comment, etc.) - Implementation would go here  */}
    </div>
  );
};

export default FeedItem;
