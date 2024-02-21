// WebSocketContext.js
import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8000/ws/chat/'); // Replace with your server URL
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
