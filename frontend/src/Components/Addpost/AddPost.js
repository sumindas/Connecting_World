import React from 'react'
import './addpost.css'

import CurrentUserData from '../../FackApis/CurrentUserData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faSmile, faTags, faVideo } from '@fortawesome/free-solid-svg-icons'

export default function AddPost() {
  return (
    <form className='postForm' action="">
        <div className="user form-top">
            <img src = {CurrentUserData.map(user=>(user.ProfieImage))} alt="" />
            <input type="text" placeholder='What on your mind' />
            <button type='submit' className='btn btn-primary'>Post</button>
        </div>
        <div className="post-categories">
            <label htmlFor="file">
                <input type="file" id='file' />
                <span><FontAwesomeIcon icon={faImage}/>Photos</span>
            </label>
            <label htmlFor="file">
                <input type="file" id='file' />
                <span><FontAwesomeIcon icon={faVideo}/>Videos</span>
            </label>
            <span><FontAwesomeIcon icon={faTags}/>Tags</span>
            <span><FontAwesomeIcon icon={faSmile }/>Feelings</span>
        </div>
    </form>
  )
}
