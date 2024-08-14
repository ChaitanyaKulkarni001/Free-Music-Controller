import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ roomName, children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`);
        socketInstance.onopen = () => console.log('WebSocket connected');
        socketInstance.onclose = () => console.log('WebSocket disconnected');
        setSocket(socketInstance);

        return () => {
            socketInstance.close();
        };
    }, [roomName]);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
