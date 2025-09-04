const API_BASE_URL = 'http://localhost:3000/api';

export const studentService = {
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
};
