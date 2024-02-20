/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import "./friendreq.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Api/api";

export default function FriendReq() {
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const CurrentUser = useSelector((state) => state.auth.user);
  const userId = CurrentUser?.user?.id;

  useEffect(() => {
    const fetchFriendSuggestions = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user_suggestions/${userId}/`
        );
        console.log("data:", response.data);
        setFriendSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching friend suggestions:", error);
      }
    };

    fetchFriendSuggestions();
  }, [userId]);

  return (
    <div className="Friend-Requests">
      <h4
        style={{ textAlign: "center", marginTop: "10px", marginLeft: "-15px" }}
      >
        <strong>Follow Suggestions</strong>
      </h4>
      {friendSuggestions.map((friend) => (
        <div className="request" key={friend.id}>
          <Link to={`/profile/${friend.id}`}>
            <div className="info">
              <div className="user">
                {friend && friend.userprofile && friend.userprofile.profile_image ? (
                  <img
                    src={`${BASE_URL}${friend.userprofile.profile_image}`}
                    alt="Profile Photo"
                  />
                ) : null}
                <h5>{friend.username}</h5>
              </div>
              <div style={{textAlign:'center'}} className="info-name ">
                <p>{friend.userprofile?.location}</p>
              </div>
            </div>
          </Link>
          <div className="action">
            <button className="btn btn-primary">Follow</button>
          </div>
        </div>
      ))}
    </div>
  );
}
