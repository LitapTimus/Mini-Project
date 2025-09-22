import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import io from 'socket.io-client';
import MentorService from '../services/mentorService';

const ChatInterface = ({ studentId, mentorId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Connect to Socket.IO server
        socketRef.current = io(import.meta.env.VITE_API_URL.replace('/api', ''), {
            withCredentials: true
        });

        // Listen for new messages
        socketRef.current.on('message', (message) => {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
        });

        // Load existing messages
        loadMessages();

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [studentId]);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const conversation = await MentorService.getConversation(studentId);
            setMessages(conversation);
            scrollToBottom();
        } catch (err) {
            setError('Failed to load messages');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            // Send message through Socket.IO
            socketRef.current.emit('sendMessage', {
                content: newMessage,
                receiverId: studentId,
                senderId: mentorId
            });

            // Also save to database through API
            await MentorService.sendMessage(studentId, newMessage);
            
            setNewMessage('');
        } catch (err) {
            setError('Failed to send message');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={message._id || index}
                        className={`flex ${message.senderId === mentorId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                message.senderId === mentorId
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                            }`}
                        >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${
                                message.senderId === mentorId
                                    ? 'text-blue-100'
                                    : 'text-gray-500'
                            }`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSend} className="px-6 py-4 border-t">
                <div className="flex space-x-4">
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-600"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;