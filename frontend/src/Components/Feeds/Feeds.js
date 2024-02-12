// Feeds.js
import React from 'react';
import Feed from './Feed';
import {  useSelector } from 'react-redux';


export default function Feeds({feeds}) {
  const userId = useSelector((state) => state.auth.user?.user?.id);
  const posts = useSelector((state) => state.post);
  console.log("----",posts)
  console.log("User", userId);
  

  return (
    <>
    <div className="feeds">
      {feeds.map((feed) => (
        <Feed key={feed.id} post={feed} />
      ))}
    </div>
    </>
  );
}
