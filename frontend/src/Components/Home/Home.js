import React from 'react'
import Stories from '../Stories/Stories'
import AddPost from '../Addpost/AddPost'

import CurrentUserData from '../../FackApis/CurrentUserData'
import Feeds from '../Feeds/Feeds'

export default function Home() {
  return (
    <>
      <Stories />
      <AddPost />
      <Feeds />
    </>
  )
}

