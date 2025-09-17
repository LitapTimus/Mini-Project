const API_BASE_URL = 'http://localhost:3000/api';
const AUTH_BASE_URL = API_BASE_URL.replace('/api', '');

async function ensureStudentRoleOnServer() {
  try {
    const whoAmI = await fetch(`${AUTH_BASE_URL}/auth/user`, { credentials: 'include', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } });
    if (whoAmI.ok) {
      const me = await whoAmI.json();
      if (me && me.role === 'student') return;
    }
  } catch (_e) {
    // continue to attempt role set
  }

  // Attempt to set role to student on the server session (mirrors mentorService behavior)
  const selectedRole = localStorage.getItem('selectedRole');
  if (selectedRole === 'student') {
    await fetch(`${AUTH_BASE_URL}/auth/role`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'student' })
    });
  }
}

export const studentService = {
  // Create session as student
  async createSession({ mentorId, scheduledTime, duration, type, topic, description }) {
    // Make sure the server session reflects the student's role
    await ensureStudentRoleOnServer();
    const response = await fetch(`${API_BASE_URL}/sessions/student`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentorId, scheduledTime, duration, type, topic, description })
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to create session');
    }
    return await response.json();
  },
  // Get current student's profile
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Profile doesn't exist yet
        }
        throw new Error('Failed to fetch profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Create or update student profile
  async saveProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // Update specific profile fields
  async updateProfile(updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Delete student profile
  async deleteProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },

  // Search students (for mentors/recruiters)
  async searchStudents(searchParams) {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${API_BASE_URL}/students/search?${queryString}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to search students');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  },

  // Get public student profile by ID
  async getStudentById(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch student');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }
  ,
  async getMySessions() {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/student/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching student sessions:', error);
      throw error;
    }
  }
};
