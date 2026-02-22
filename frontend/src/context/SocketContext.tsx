import { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Message = {
    sender: string;
    message: string;
    channelId: string;
    createdAt?: string;
};

type SocketContextType = {
    socket: WebSocket | null;
    messages: Message[];
    sendMessage: (workspaceId: string, channelId: string, message: string) => void;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { token, user } = useAuth();
    const [socket, setSocket] = useState<WebSocket | null>(null); // Use state for socket
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    // Store socket in ref to access current value in cleanup/effects if needed, 
    // but main state is `socket` for re-renders.
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!token) {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Initialize WebSocket
        const socketBaseUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000';
        const wsUrl = `${socketBaseUrl}?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
            socketRef.current = ws;
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.message && data.sender) {
                    setMessages((prev) => [...prev, data]);
                }
            } catch (error) {
                console.error("Failed to parse websocket message", error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            socketRef.current = null;
            setSocket(null);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [token]);

    const sendMessage = (workspaceId: string, channelId: string, message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const payload = {
                workspaceId,
                channelId,
                message,
                sender: user?._id // Optimistic updates might need this, but backend handles sender from token
            };
            socketRef.current.send(JSON.stringify(payload));
        } else {
            console.error("Socket is not open");
        }
    };

    return (
        <SocketContext.Provider value={{ socket, messages, sendMessage, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
