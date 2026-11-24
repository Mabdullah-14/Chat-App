import React, { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import { useAuth } from './authContext';

const socketContext = createContext(null);

export const useSocket = () => useContext(socketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }
       
        const newSocket = io('http://localhost:5000', {
            transports: ['websocket'],
            withCredentials: true 
        });

        newSocket.on('connect', () => {
            console.log(' Socket connected to backend securely using HttpOnly Cookie!');
        });
        
        newSocket.on('connect_error', (err) => {
            console.error(' Socket security block or handshake failed:', err.message);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.off('connect');
                newSocket.off('connect_error');
                newSocket.disconnect();
            }
        };
    }, [user?.id]); 

    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    ); 
};
