import React from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'

//Pages................
import Login from '../Login/login'
import { SignUp } from '../Signup/SignUp'

import Profile from '../Profile/Profile'
import ChatBox from '../Chatbox/ChatBox'
import Home from '../Home/Home'
import NavBar from '../NavBar/NavBar'
import LeftBar from '../LeftBar/LeftBar'
import RightBar from '../RightBar/RightBar'


export default function LayOut() {

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
      element:<Feed />,
      children: [
        {
          path: '/',
          element : <Home />
        },
        {
          path: '/profile/:id',
          element : <Profile />
        },
        {
          path: '/chat/:id',
          element : <ChatBox />
        },
      ]
    },
    {
      path : '/login',
      element : <Login />
    },
    {
      path : '/signup',
      element : <SignUp />
    }
  ])
  return (
    <>
        <RouterProvider router = {router} />
    </>
  )
}
