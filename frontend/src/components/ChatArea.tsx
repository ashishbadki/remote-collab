import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { deleteMessageApi } from "../api/message.api";

type ChatAreaProps = {
    channelName?: string;
    channelId?: string;
    workspaceId?: string;
    canDeleteAnyMessage?: boolean;
};

type Message = {
    _id?: string;
    sender: {
        _id: string;
        name: string;
    } | string; // sender can be object populate from DB or string ID from socket
    message: string;
    createdAt?: string;
};

export const ChatArea = ({ channelName, channelId, workspaceId, canDeleteAnyMessage = false }: ChatAreaProps) => {
    const { messages: socketMessages, sendMessage } = useSocket();
    const { user, token } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!channelId || !token) return;
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/messages/${channelId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data.message) {
                    setMessages(response.data.message);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, [channelId, token]);

    // Handle incoming socket messages
    useEffect(() => {
        const lastMessage = socketMessages[socketMessages.length - 1];
        if (lastMessage && lastMessage.channelId === channelId) {
            // Check if message already exists to prevent duplicates if any
            setMessages((prev) => {
                // If the message is from self (optimistically added) we might get it back from socket
                // For now, simpler to just append. 
                // In a real app we'd handle deduplication by temp ID.
                return [...prev, {
                    sender: lastMessage.sender,
                    message: lastMessage.message,
                    createdAt: new Date().toISOString()
                } as Message];
            });
        }
    }, [socketMessages, channelId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleSendMessage = () => {
        if (!newMessage.trim() || !channelId || !workspaceId) return;

        sendMessage(workspaceId, channelId, newMessage);

        // Optimistic update
        /* 
        // Commented out to rely on socket echo for now to avoid duplications without temp IDs
        setMessages((prev) => [
            ...prev,
            {
                sender: { _id: user?._id || "", username: user?.username || "You" },
                message: newMessage,
                createdAt: new Date().toISOString(),
            },
        ]);
        */
        setNewMessage("");
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteMessageApi(messageId);
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        } catch (error) {
            console.error("Failed to delete message:", error);
            alert("Failed to delete message");
        }
    };

    if (!channelName) {
        return (
            <div className="flex h-full flex-1 flex-col items-center justify-center bg-white text-gray-500">
                <div className="mb-4 rounded-full bg-gray-100 p-6">
                    <svg
                        className="h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Welcome to the Workspace</h3>
                <p className="max-w-md text-center text-sm">
                    Select a channel from the sidebar to start chatting or create a new one to get discussions going.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-1 flex-col bg-white">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
                <div className="flex items-center gap-2">
                    <span className="text-2xl text-gray-400">#</span>
                    <h2 className="text-lg font-bold text-gray-900">{channelName}</h2>
                </div>
                {/* ... existing header content ... */}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                    {messages.map((msg, index) => {
                        const isMe = typeof msg.sender === 'string' ? msg.sender === user?._id : msg.sender._id === user?._id;
                        // Determine if the user can delete this specific message
                        // Logic: They are the sender OR they have admin/owner privileges (canDeleteAnyMessage)
                        const canDelete = isMe || canDeleteAnyMessage;

                        const senderName = typeof msg.sender === 'string' ? 'User' : (msg.sender.name || 'Unknown');

                        return (
                            <div key={index} className={`group flex items-start gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                                <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${isMe ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {senderName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className={`flex items-baseline gap-2 ${isMe ? 'justify-end' : ''}`}>
                                        <span className="font-bold text-gray-900">{isMe ? 'You' : senderName}</span>
                                        <span className="text-xs text-gray-500">
                                            {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {canDelete && (
                                            <button
                                                onClick={() => handleDeleteMessage(msg._id!)}
                                                className="ml-2 rounded p-1 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                                                title="Delete Message"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <p className={`text-gray-800 ${isMe ? 'text-right' : ''}`}>{msg.message}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5">
                    {/* ... existing input toolbar ... */}
                    <input
                        type="text"
                        className="w-full bg-transparent p-3 placeholder-gray-400 focus:outline-none"
                        placeholder={`Message #${channelName}`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <div className="flex items-center justify-between p-2">
                        <div className="text-xs text-gray-400">
                            <strong>Return</strong> to send
                        </div>
                        <button
                            onClick={handleSendMessage}
                            className="rounded p-1.5 text-indigo-500 hover:bg-indigo-50"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
