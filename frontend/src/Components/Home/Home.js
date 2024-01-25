import React from 'react'
import Stories from '../Stories/Stories'
import AddPost from '../Addpost/AddPost'

import CurrentUserData from '../../FackApis/CurrentUserData'
import Feeds from '../Feeds/Feeds'
import { useSelector } from 'react-redux'

export default function Home() {
  const loggedUser = useSelector((state)=>state.auth.user)
  const token = useSelector((state)=>state.auth.token)
  const state = useSelector((state)=>state)
  console.log("State:",state)
  console.log("User:",loggedUser)
  console.log("Token:",token)
  return (
    <>
      <Stories />
      <AddPost />
      <Feeds />
    </>
  )
}

