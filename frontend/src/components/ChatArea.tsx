import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

import { deleteMessageApi, getMessagesByChannelApi } from "../api/message.api";
import { Search, MoreVertical, Phone, Video, Smile, Paperclip, Mic, Send, CheckCheck, Trash2 } from "lucide-react";

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
    } | string;
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
                const data = await getMessagesByChannelApi(channelId);
                if (data.message) {
                    setMessages(data.message);
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
            setMessages((prev) => {
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
            <div className="flex h-full flex-1 flex-col items-center justify-center bg-[#f0f2f5] text-gray-500 border-l border-gray-300">
                <div className="mb-4">
                    {/* WhatsApp Intro Art Placeholder */}
                    <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto opacity-50">
                        <span className="text-4xl">👋</span>
                    </div>
                </div>
                <h3 className="text-3xl font-light text-gray-600 mb-4">Welcome to RemoteCollab</h3>
                <p className="max-w-md text-center text-sm text-gray-400">
                    Send and receive messages without keeping your phone online.
                    <br />
                    Use RemoteCollab on up to 4 linked devices and 1 phone.
                </p>
                <div className="mt-8 text-xs text-gray-400 flex items-center gap-1">
                    <span className="opacity-60">🔒</span> End-to-end encrypted
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-1 flex-col bg-[#efeae2] relative">
            {/* Background Pattern Overlay (Optional) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
            </div>

            {/* Header */}
            <div className="flex px-4 py-2.5 items-center justify-between bg-[#f0f2f5] border-l border-gray-300 z-10">
                <div className="flex items-center gap-4 cursor-pointer">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                            {/* Initials Avatar */}
                            <span className="text-gray-600 font-medium text-lg">
                                {channelName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {/* Online Status Dot */}
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-base font-medium text-gray-900 leading-tight">#{channelName}</h2>
                        <span className="text-xs text-gray-500 leading-tight">click here for channel info</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-gray-500">
                    <button className="hover:bg-gray-200 p-2 rounded-full transition-colors">
                        <Video className="h-5 w-5" />
                    </button>
                    <button className="hover:bg-gray-200 p-2 rounded-full transition-colors">
                        <Phone className="h-5 w-5" />
                    </button>
                    <div className="w-[1px] h-6 bg-gray-300 mx-1"></div>
                    <button className="hover:bg-gray-200 p-2 rounded-full transition-colors">
                        <Search className="h-5 w-5" />
                    </button>
                    <button className="hover:bg-gray-200 p-2 rounded-full transition-colors">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 z-10 sm:px-10 custom-scrollbar">
                <div className="space-y-1">
                    {messages.map((msg, index) => {
                        const isMe = typeof msg.sender === 'string' ? msg.sender === user?._id : msg.sender._id === user?._id;
                        const canDelete = isMe || canDeleteAnyMessage;
                        const senderName = typeof msg.sender === 'string' ? 'User' : (msg.sender.name || 'Unknown');
                        const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                        return (
                            <div key={index} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} group mb-1`}>
                                <div className={`relative max-w-[65%] sm:max-w-[50%] px-2 py-1.5 rounded-lg shadow-sm text-sm 
                                    ${isMe
                                        ? 'bg-[#d9fdd3] rounded-tr-none'
                                        : 'bg-white rounded-tl-none'
                                    }`}>

                                    {/* Sender Name in Group Chat (only for received messages) */}
                                    {!isMe && (
                                        <div className="text-xs font-medium text-orange-400 mb-0.5 px-1">
                                            {senderName}
                                        </div>
                                    )}

                                    <div className="px-1 relative pb-4 min-w-[80px]">
                                        <span className="text-[#111b21] text-[14.2px] leading-[19px] break-words whitespace-pre-wrap">
                                            {msg.message}
                                        </span>

                                        {/* Timestamp & Status */}
                                        <div className="absolute bottom-0 right-0 flex items-center gap-1 text-[11px] text-gray-500 select-none opacity-70">
                                            <span>{time}</span>
                                            {isMe && (
                                                <CheckCheck className="h-4 w-4 text-blue-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Hover Delete Button */}
                                    {canDelete && (
                                        <button
                                            onClick={() => handleDeleteMessage(msg._id!)}
                                            className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 rounded-bl-lg hover:bg-red-50 hover:text-red-500"
                                            title="Delete Message"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}

                                    {/* Triangle Tail */}
                                    <div className={`absolute top-0 w-3 h-3 overflow-hidden ${isMe ? '-right-2' : '-left-2'}`}>
                                        <div className={`w-4 h-4 transform rotate-45 origin-bottom-left ${isMe ? 'bg-[#d9fdd3] translate-y-[2px] -translate-x-2' : 'bg-white translate-y-[2px] translate-x-1.5'}`}></div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] px-4 py-3 flex items-center gap-4 z-10 border-l border-gray-300">
                <button className="text-gray-500 hover:text-gray-600">
                    <Smile className="h-6 w-6" />
                </button>
                <button className="text-gray-500 hover:text-gray-600">
                    <Paperclip className="h-5 w-5" />
                </button>

                <div className="flex-1 bg-white rounded-lg px-4 py-2 flex items-center">
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-[#111b21] placeholder-gray-500 text-[15px]"
                        placeholder="Type a message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                </div>

                <div className="flex items-center justify-center">
                    {newMessage.trim() ? (
                        <button
                            onClick={handleSendMessage}
                            className="text-[#00a884] hover:text-[#008f72] p-2 rounded-full transition-all"
                        >
                            <Send className="h-6 w-6" />
                        </button>
                    ) : (
                        <button className="text-gray-500 hover:text-gray-600 p-2 rounded-full">
                            <Mic className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
