import React, { useState, useEffect } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import MentorService from '../services/mentorService';

const MessagesList = ({ onSelectStudent, selectedStudentId }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const messages = await MentorService.getRecentMessages();
            // Group messages by student
            const grouped = messages.reduce((acc, msg) => {
                const studentId = msg.sender._id === selectedStudentId ? msg.receiver._id : msg.sender._id;
                if (!acc[studentId]) {
                    acc[studentId] = {
                        student: msg.sender._id === selectedStudentId ? msg.receiver : msg.sender,
                        messages: []
                    };
                }
                acc[studentId].messages.push(msg);
                return acc;
            }, {});
            
            setConversations(Object.values(grouped));
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv => 
        conv.student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="divide-y">
                {filteredConversations.map((conv) => (
                    <button
                        key={conv.student._id}
                        onClick={() => onSelectStudent(conv.student._id)}
                        className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 ${
                            selectedStudentId === conv.student._id ? 'bg-blue-50' : ''
                        }`}
                    >
                        <div className="relative">
                            <img
                                src={conv.student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.student.name)}`}
                                alt={conv.student.name}
                                className="w-12 h-12 rounded-full"
                            />
                            {conv.messages.some(m => !m.read && m.sender._id === conv.student._id) && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-gray-900">{conv.student.name}</h3>
                            {conv.messages.length > 0 && (
                                <p className="text-sm text-gray-600 truncate">
                                    {conv.messages[conv.messages.length - 1].content}
                                </p>
                            )}
                        </div>
                        <div className="text-xs text-gray-500">
                            {conv.messages.length > 0 && new Date(conv.messages[conv.messages.length - 1].timestamp).toLocaleTimeString()}
                        </div>
                    </button>
                ))}

                {filteredConversations.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                        <p>No conversations found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesList;