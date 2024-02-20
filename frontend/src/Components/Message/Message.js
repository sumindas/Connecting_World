/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Message() {
  const [followedUsers, setFollowedUsers] = useState([]);
  const CurrentUser = useSelector((state) => state.auth.user);
  const userId = CurrentUser?.user?.id;

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/followed_users/${userId}/`
        );
        setFollowedUsers(response.data);
      } catch (error) {
        console.error("Error fetching followed users:", error);
      }
    };

    fetchFollowedUsers();
  }, [userId]);

  return (
    <div className="Messages">
      <div className="message-top flex justify-between items-center px-4 py-2 bg-gray-200 rounded-lg text-center">
        <h4 className="text-lg ml-8 font-semibold">Messages</h4>
        <FontAwesomeIcon icon={faEdit} className="text-gray-500" />
      </div>
      <div className="message-search flex items-center px-4 py-2 bg-white border-b border-gray-200">
        <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
        <input
          type="search"
          placeholder="Search Message"
          className="ml-2 outline-none"
        />
      </div>
      <div className="border-div"></div>
      {followedUsers.length > 0 ? (
        followedUsers.map((user) => (
          <Link
            to={`chat/${user.id}`}
            key={user.id}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            <div className="message flex items-center">
              <div className="user mr-4">
                {user && user.userprofile && user.userprofile.profile_image ? (
                  <img
                    src={user.userprofile.profile_image}
                    alt="Profile Photo"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">?</span>
                  </div>
                )}
              </div>
              <div className="message-body">
                <h5 className="font-semibold">{user.username}</h5>
                <p className="text-sm text-gray-500">{user.bio}</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="px-4 py-2 text-center text-gray-500">
          No followed users found
        </div>
      )}
    </div>
  );
}
