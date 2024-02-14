// import React from 'react'


// export default function Home() {

//   return (
//     <>
//       {/* <Stories /> */}
//       {/* <AddPost />
//       <Feeds /> */}
//     </>
//   )
// }

import React, { useState, useEffect } from 'react';
import FeedItem from './FeedItem';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      // ... logic to fetch posts from the backend based on followed users.
      // ... store fetched posts in the 'posts' state.
    };

    fetchPosts();  
  }, []);

  return (
    <div className="container mx-auto px-4"> {/* Tailwind container */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts to display yet.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <FeedItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
