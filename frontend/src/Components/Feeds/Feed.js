import React from 'react'
import './feeds.css'
import { Link } from 'react-router-dom'


import Comments from '../Comments/Comments'



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart, faListDots, faShare } from '@fortawesome/free-solid-svg-icons'

import { useState } from 'react'

export default function Feed({fed}) {

    let [openComment,setOpenComment] = useState(false)

    const CommentHandler = () =>{
        setOpenComment(!openComment)
    }

  return (
    <div className="feed" key={fed.id}>
        <div className="top-content">
            <Link to={'/profile/id'}>
                <div className="user">
                    <img src= {fed.feedProfile} alt="" />
                    <div className="div">
                        <h5>{fed.name}</h5>
                        <small>1 minutes Ago</small>
                    </div>
                </div>
            </Link>
            <span><FontAwesomeIcon icon={faListDots} /></span>
        </div>
        <div className="mid-content">
            <p>{fed.desc}</p>
            <img src={fed.feedImage} alt="" />
        </div>
        <div className="bottom-content">
            <div className="action-item">
                <span><FontAwesomeIcon icon={faHeart} />14 Likes</span>
            </div>
            <div className="action-item" onClick={CommentHandler}>
                <span><FontAwesomeIcon icon={faComment} />4 Comments</span>
            </div>
            <div className="action-item">
                <span><FontAwesomeIcon icon={faShare} />1 Share</span>
            </div>
        </div>
        {openComment && <Comments />}
    </div>
  )
}
