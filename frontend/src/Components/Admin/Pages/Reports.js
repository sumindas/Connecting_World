import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import ConfirmationModal from './ConfirmationPost';

const PostList = () => {
 const [posts, setPosts] = useState([]);
 const [selectedPost, setSelectedPost] = useState(null);
 const [showConfirmationModal, setShowConfirmationModal] = useState(false);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/socialadmin/admin/reports/');
        console.log(response.data)
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchData();
 }, []);


 const handleRejectPostClick = (postId) => {
    console.log(postId)
    setSelectedPost(postId);
    setShowConfirmationModal(true);
  };

  const handleConfirmRejection = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/socialadmin/posts/${selectedPost}/`);
  
      const updatedPosts = posts.filter(post => post.id !== selectedPost);
      setPosts(updatedPosts);

      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      // Handle errors, e.g., show an error message to the user
    }
  };
 

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

 return (
    <>
        <AdminNavbar />
        <div className="container mx-auto my-5">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Post ID</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Report Count</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="py-2 px-4 border-b">{post.id}</td>
              <td className="py-2 px-4 border-b">{new Date(post.created_at).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{post.user__username}</td>
              <td className="py-2 px-4 border-b">{post.report_count}</td>
              <td className="py-2 px-4 border-b">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleRejectPostClick(post.id)}>
                    Reject
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* Confirmation Modal */}
    {selectedPost && (
        <ConfirmationModal
          show={showConfirmationModal}
          onHide={closeConfirmationModal}
          onConfirm={handleConfirmRejection}
          title="Reject Post"
          message="Are you sure you want to reject this post?"
        />
      )}
    </>
 );
};

export default PostList;
