import React from 'react'
import './rightbar.css'
import Message from '../Message/Message'
import FriendReq from '../Friendreq/FriendReq'


export default function RightBar() {
  return (
    <div className="rightBar">
      <div className="rightbar-container">
        <Message />
        <FriendReq />
      </div>
    </div>
  )
}
