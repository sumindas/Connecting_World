import React, { useSelector } from 'react-redux'
import {  Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'


//Pages................
import Login from '../Login/login'
import { SignUp } from '../Signup/SignUp'

import Profile from '../Profile/Profile'
import ChatBox from '../Chatbox/ChatBox'
import Home from '../Home/Home'
import NavBar from '../NavBar/NavBar'
import LeftBar from '../LeftBar/LeftBar'
import RightBar from '../RightBar/RightBar'
import Verification from '../Verification/Verify'
import AdminLogin from '../Admin/Pages/login'
import AdminHome from '../Admin/Pages/AdminHome'
import Users from '../Admin/Pages/Users'
import OtherUser from '../Userprofile/otherUserProfile'
import Posts from '../Admin/Pages/Posts'
import ChatRoom from '../Chatbox/ChatRoom'
import NotificationComponent from '../Home/Notifications'
import PasswordReset from '../Verification/PasswordReset'



export default function LayOut() {


  // const loggedUser = useSelector((state)=>state.auth.user)
  // console.log(loggedUser.id)
  //loggedInUser
  //Feed............
  const Feed = () => {
    return (
      <>
      <NavBar />
      <main>
        <LeftBar />
        <div className="container">
          <Outlet />
        </div>
        <RightBar />
      </main>
      </>
    )
  }

  //Router................
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login /> 
    },
    {
      path: '/signup',
      element: <SignUp />
    },
    {
      path: '/verify',
      element: <Verification />
    },
    {
      path : '/resetpassword',
      element : <PasswordReset />
    },
    {
      path : '/admin',
      element : <AdminLogin />,
    },
    {
      path : '/adminhome',
      element : <AdminHome />
    },
    {
      path : '/userslist',
      element : <Users />
    },
    {
      path: '/postlist',
      element : <Posts />
    },
    {
      path: '/home', 
      element: <Feed />,
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'chat/:id',
          element: <ChatBox />
        },
        {
          path: 'user/:id', 
          element: <OtherUser />
        },
        {
          path : 'chats/:id',
          element : <ChatRoom />
        },
        {
          path : 'notificatins/:id',
          element : <NotificationComponent />
        },
      ]
    }
  ])


  return (
    <>
        <RouterProvider router = {router} />
    </>
  )
}
