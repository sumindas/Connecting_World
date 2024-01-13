import React from 'react'
import './chatbox.css'


import Stories from '../Stories/Stories'
import CurrentUserData from '../../FackApis/CurrentUserData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight, faFileAlt, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons'

export default function ChatBox() {
  return (
    <>
      <Stories />
      <div className="chat-box">
        <div className="chat-box-top">
            <img src={CurrentUserData.map(user=>(user.ProfieImage))} alt="" />
            <div className="user-name">
              <h3>{CurrentUserData.map(user=>(user.name))}</h3>
              <h5>{CurrentUserData.map(user=>(user.username))}</h5>
            </div>
            <div className="call-icons">
              <label className='btn btn-primary' htmlFor="CFile">
              <FontAwesomeIcon icon={faVideo}  />
              </label>
              <label className='btn btn-primary' htmlFor="CFile">
              <FontAwesomeIcon icon={faPhone} />
              </label>
          </div>
        </div>
        <div className="chat-box-bottom">
            <form action="">
              <input type="text" placeholder='Write Something' />
              <button type='submit' className='btn btn-primary'>
                <FontAwesomeIcon icon={faArrowCircleRight} />
              </button>
            </form>
        </div>
      </div>
    </>
  )
}
