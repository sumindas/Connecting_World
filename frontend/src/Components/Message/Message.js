import React from 'react'
import './message.css'
import { Link } from 'react-router-dom'


import MessageData from '../../FackApis/MessageData'

import { FontAwesomeIcon } from  '@fortawesome/react-fontawesome'
import {faEdit,faSearch} from '@fortawesome/free-solid-svg-icons'


export default function Message() {
  return (
    <div className="Messages">
        <div className="message-top">
            <h4>Messages</h4>
            <FontAwesomeIcon icon={faEdit} />
        </div>
        <div className="message-search">
            <FontAwesomeIcon icon={faSearch} />
            <input type="search" placeholder='Search Message' name="" id="" />
        </div>
        <div className="border-div"></div>
        {
            MessageData.map(mess=>(
                <Link to = '/chat/id'>
                    <div className="message" key={mess.id}>
                        <div className="user">
                            <img src={mess.img} alt="" />
                            <div className="green-active"></div>
                            </div>
                                    <div className="message-body">
                                        <h5>{mess.name}</h5>
                                        <p>{mess.mText}</p>
                                    </div>
                            </div>
                </Link>
            ))
        }
    </div>
  )
}
