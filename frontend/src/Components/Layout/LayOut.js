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
import UserProfileSettings from '../Profile/UserProfileSettings'
import AdminLogin from '../Admin/Login/login'


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
      path : '/admin',
      element : <AdminLogin />
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
          path: 'profileSettings', 
          element: <UserProfileSettings />
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
