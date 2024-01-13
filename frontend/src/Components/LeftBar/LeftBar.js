import React from 'react'
import './leftbar.css'
import { Link } from 'react-router-dom'
import CurrentUser from '../../FackApis/CurrentUserData'

//Icons images.............
import Firend from '../../assets/icon/1.png'
import Groups from '../../assets/icon/2.png'
import Market from '../../assets/icon/3.png'
import Watch from '../../assets/icon/4.png'
import Gallery from '../../assets/icon/5.png'
import videos from '../../assets/icon/6.png'
import message from '../../assets/icon/7.png'




export default function LeftBar() {
  return (
    <div className="leftBar">
      <div className="left-container">
        <div className="menu">
          <Link to = '/profile/id'>
            <div className="user">
              <img src={CurrentUser.map(user=>(user.ProfieImage))} alt="" />
              <h4 style={{marginLeft:'10px'}}>Mark Antony</h4>
            </div>
          </Link>
          <Link to = '/'>
            <div className="item">
              <img src={Firend} alt="" />
              <h4>Friends</h4>
            </div>
          </Link>

          <Link to = '/'>
            <div className="item">
              <img src={Groups} alt="" />
              <h4>Groups</h4>
            </div>
          </Link>

          <Link to = '/'>
            <div className="item">
              <img src={Market} alt="" />
              <h4>Market</h4>
            </div>
          </Link>

          <Link to = '/'>
            <div className="item">
              <img src={Watch} alt="" />
              <h4>Watch</h4>
            </div>
          </Link>
        </div>

        <hr />

        <div className="menu">
          <h4 className='others'>Shortcuts</h4>
          <Link to = '/'>
            <div className="item">
              <img src={Gallery} alt="" />
              <h4>Gallery</h4>
            </div>
          </Link>

          <Link to = '/'>
            <div className="item">
              <img src={videos} alt="" />
              <h4>Videos</h4>
            </div>
          </Link>

          <Link to = '/chat/id'>
            <div className="item">
              <img src={message} alt="" />
              <h4>Messages</h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
