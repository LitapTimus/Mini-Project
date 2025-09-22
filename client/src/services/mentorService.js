import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies/session
    headers: {
        'Content-Type': 'application/json'
    }
});

// Check auth state before making requests
const checkAuth = async () => {
    try {
        const response = await axios.get(`${API_URL.replace('/api', '')}/auth/user`, { 
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!response.data) {
            throw new Error('Authentication failed');
        }

        // If not a mentor, first try to set role
        if (response.data.role !== 'mentor') {
            const selectedRole = localStorage.getItem('selectedRole');
            if (selectedRole === 'mentor') {
                // Try to set role
                await axios.post(`${API_URL.replace('/api', '')}/auth/role`, { role: 'mentor' }, { withCredentials: true });
                // Verify role was set
                const verifyResponse = await axios.get(`${API_URL.replace('/api', '')}/auth/user`, { withCredentials: true });
                if (!verifyResponse.data || verifyResponse.data.role !== 'mentor') {
                    throw new Error('Role verification failed');
                }
                return verifyResponse.data;
            }
            throw new Error('Not authenticated as mentor');
        }
        
        return response.data;
    } catch (error) {
        console.error('Auth check failed:', error);
        // Only redirect if it's an auth error
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            window.location.href = '/role-selection';
        }
        throw error;
    }
};

const MentorService = {
    // Profile Management
    getMentorProfile: async () => {
        try {
            // Check auth state first
            await checkAuth();
            
            const response = await api.get('/mentors/profile');
            return response.data;
        } catch (error) {
            console.error('Error getting mentor profile:', error.response?.data || error.message);
            throw error;
        }
    },

    updateMentorProfile: async (profileData) => {
        await checkAuth();
        const response = await api.put('/mentors/profile', profileData);
        return response.data;
    },

    // Student Management
    getMentorStudents: async () => {
        await checkAuth();
        const response = await api.get('/mentors/students');
        return response.data;
    },

    // Stats and Analytics
    getMentorStats: async () => {
        await checkAuth();
        const response = await api.get('/mentors/stats');
        return response.data;
    },

    // Availability Management
    updateAvailability: async (available) => {
        await checkAuth();
        const response = await api.put('/mentors/availability', { available });
        return response.data;
    },

    // Session Management
    getUpcomingSessions: async () => {
        await checkAuth();
        const response = await api.get('/sessions/mentor');
        return response.data;
    },

    getPendingSessions: async () => {
        await checkAuth();
        const response = await api.get('/sessions/pending');
        return response.data;
    },

    createSession: async (sessionData) => {
        await checkAuth();
        const response = await api.post('/sessions', sessionData);
        return response.data;
    },

    updateSessionStatus: async (sessionId, status) => {
        await checkAuth();
        const response = await api.put(`/sessions/${sessionId}/status`, { status });
        return response.data;
    },

    addSessionFeedback: async (sessionId, feedback) => {
        await checkAuth();
        const response = await api.post(`/sessions/${sessionId}/feedback`, feedback);
        return response.data;
    },

    // Message Management
    sendMessage: async (receiverId, content) => {
        await checkAuth();
        const response = await api.post('/messages', { receiverId, content });
        return response.data;
    },

    getConversation: async (userId) => {
        await checkAuth();
        const response = await api.get(`/messages/conversation/${userId}`);
        return response.data;
    },

    getUnreadCount: async () => {
        await checkAuth();
        const response = await api.get('/messages/unread');
        return response.data;
    },

    getRecentMessages: async () => {
        await checkAuth();
        const response = await api.get('/messages/recent');
        return response.data;
    },

    markMessageAsRead: async (messageId) => {
        await checkAuth();
        const response = await api.put(`/messages/${messageId}/read`);
        return response.data;
    }
};

export default MentorService;