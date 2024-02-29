import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
};

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const { id } = useParams();
    const BASE_URL = 'http://localhost:8000'; // Replace with your actual base URL

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/chat/user/${id}/notifications/`);
                setNotifications(response.data);
            } catch (error) {
                console.error('There was a problem with your fetch operation:', error);
            }
        };

        fetchNotifications();
    }, [id]);

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
            <div className="md:flex">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Notifications</div>
                    <p className="mt-2 text-gray-500">Here are your latest notifications.</p>
                    <ul className="mt-4">
                        {notifications.map((notification, index) => (
                            <li key={index} className="bg-gray-100 rounded-lg p-4 mt-2 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="text-sm font-bold text-gray-600">{notification.content}</div>
                                    <div style={{marginLeft:'20px'}} className="text-xs text-gray-500">{formatTimeAgo(new Date(notification.timestamp))}</div>
                                </div>
                                <div style={{marginLeft:'20px'}}>
                                    {notification.post ? (
                                        <a href={`/post/${notification.post.id}`} className="text-blue-500 hover:bold">View Post</a>
                                    ) : (
                                        <a href={`/user/${notification.user.id}`} className="text-blue-500 hover:bold">View Profile</a>
                                    )}
                                </div>
                                
                            </li>
                        ))}
                        
                    </ul>
                    
                </div>
            </div>
        </div>
    );
};

export default NotificationComponent;
