import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem("token");
    const { id } = useParams();

    useEffect(() => {
        const socket = new WebSocket(`ws://${window.location.host}/ws/notifications/${id}/?token=${token}`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data.message);
            setNotifications(prevNotifications => [...prevNotifications, data.message]);
        };

        socket.onclose = (event) => {
            console.error('WebSocket connection closed', event);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationComponent;
