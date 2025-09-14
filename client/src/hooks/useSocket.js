import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (goalId, userId) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
            transports: ['websocket'],
            upgrade: true,
            rememberUpgrade: true
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
            
            // Join goal-specific room
            if (goalId) {
                newSocket.emit('join-goal', goalId);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        // Message event handlers
        newSocket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        newSocket.on('user-typing', (data) => {
            if (data.userId !== userId) {
                setTypingUsers(prev => {
                    if (data.isTyping) {
                        return [...prev.filter(id => id !== data.userId), data.userId];
                    } else {
                        return prev.filter(id => id !== data.userId);
                    }
                });
            }
        });

        newSocket.on('progress-changed', (data) => {
            // Handle real-time progress updates
            console.log('Progress updated:', data);
        });

        return () => {
            newSocket.close();
        };
    }, [goalId, userId]);

    const sendMessage = (message) => {
        if (socket && goalId && userId) {
            socket.emit('chat-message', {
                goalId,
                message,
                userId
            });
        }
    };

    const sendTyping = (isTyping) => {
        if (socket && goalId && userId) {
            socket.emit('typing', {
                goalId,
                userId,
                isTyping
            });
        }
    };

    const updateProgress = (progressData) => {
        if (socket && goalId) {
            socket.emit('progress-update', {
                goalId,
                ...progressData
            });
        }
    };

    return {
        socket,
        isConnected,
        messages,
        typingUsers,
        sendMessage,
        sendTyping,
        updateProgress
    };
};
