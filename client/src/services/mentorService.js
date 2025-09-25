import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Axios instance sending session cookies (Passport) instead of JWT
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const MentorService = {
  // Profile Management
  getMentorProfile: async () => {
    try {
      const response = await api.get("/mentors/profile");
      return response.data;
    } catch (error) {
      console.error(
        "Error getting mentor profile:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateMentorProfile: async (profileData) => {
    const response = await api.put("/mentors/profile", profileData);
    return response.data;
  },

  // Student Management
  getMentorStudents: async () => {
    const response = await api.get("/mentors/students");
    return response.data;
  },

  // Stats and Analytics
  getMentorStats: async () => {
    const response = await api.get("/mentors/stats");
    return response.data;
  },

  // Availability Management
  updateAvailability: async (available) => {
    const response = await api.put("/mentors/availability", { available });
    return response.data;
  },

  // Session Management
  getUpcomingSessions: async () => {
    const response = await api.get("/sessions/mentor");
    return response.data;
  },

  getPendingSessions: async () => {
    const response = await api.get("/sessions/pending");
    return response.data;
  },

  createSession: async (sessionData) => {
    const response = await api.post("/sessions", sessionData);
    return response.data;
  },

  updateSessionStatus: async (sessionId, status) => {
    const response = await api.put(`/sessions/${sessionId}/status`, { status });
    return response.data;
  },

  addSessionFeedback: async (sessionId, feedback) => {
    const response = await api.post(`/sessions/${sessionId}/feedback`, feedback);
    return response.data;
  },

  // Message Management
  sendMessage: async (receiverId, content) => {
    const response = await api.post("/messages", { receiverId, content });
    return response.data;
  },

  getConversation: async (userId) => {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/messages/unread");
    return response.data;
  },

  getRecentMessages: async () => {
    const response = await api.get("/messages/recent");
    return response.data;
  },

  markMessageAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`, {});
    return response.data;
  },
};

export default MentorService;
