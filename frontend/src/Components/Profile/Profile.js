/* eslint-disable no-unused-vars */
import React from 'react'
import { UseSelector, useSelector } from 'react-redux'


import UserProfile from '../Userprofile/UserProfile'
import AddPost from '../Addpost/AddPost'
import Feeds from '../Feeds/Feeds'

export default function Profile() {
  const userId = useSelector((state)=>state.auth.user.id)
  console.log("userid in User Page:",userId)
  return (
    <>
        <UserProfile userId = {userId} />
        <AddPost />
        {/* <Feeds /> */}
    </>
  )
}
