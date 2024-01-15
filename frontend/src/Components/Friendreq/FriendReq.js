import React from 'react'
import './friendreq.css'
import FirendReqData from '../../FackApis/FirendReqData'
import { Link } from 'react-router-dom'

export default function FriendReq() {

  return (
    <div className="Friend-Requests">
        <h4 style={{textAlign:'center',marginTop:'10px',marginLeft:'-15px'}}><strong>Follow Requests</strong></h4>
        {
            FirendReqData.map(friend=>(
                <div className="request">
                    <Link to = '/profile/id'>
                        <div className="info" key={friend.id}>
                            <div className="user">
                                <img src={friend.img} alt="" />
                                <h5>{friend.name}</h5>
                            </div>
                            <div className="info-name">
                                <p>{friend.info}</p>
                            </div>
                        </div>
                    </Link>
                    <div className="action">
                        <button className='btn btn-primary'>Follow</button>
                        <button className='btn btn-red'>Delete</button>
                    </div>
                </div>
                
            ))
        }
    </div>

  )
}
