const API_BASE_URL = "http://localhost:3000/api";
const AUTH_BASE_URL = API_BASE_URL.replace("/api", "");

// Helper function to get auth headers with JWT token
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function ensureStudentRoleOnServer() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const whoAmI = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (whoAmI.ok) {
      const me = await whoAmI.json();
      if (me && me.user && me.user.role === "student") return;
    }
  } catch (_e) {
    // continue
  }
}

export const studentService = {
  // Create session as student
  async createSession({
    mentorId,
    scheduledTime,
    duration,
    type,
    topic,
    description,
  }) {
    // Make sure the server session reflects the student's role
    await ensureStudentRoleOnServer();
    const response = await fetch(`${API_BASE_URL}/sessions/student`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        mentorId,
        scheduledTime,
        duration,
        type,
        topic,
        description,
      }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Failed to create session");
    }
    return await response.json();
  },
  // Get current student's profile
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Profile doesn't exist yet
        }
        throw new Error("Failed to fetch profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  // Create or update student profile
  async saveProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  },

  // Update specific profile fields
  async updateProfile(updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Delete student profile
  async deleteProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  },

  // Search students (for mentors/recruiters)
  async searchStudents(searchParams) {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(
        `${API_BASE_URL}/students/search?${queryString}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search students");
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching students:", error);
      throw error;
    }
  },

  // Get public student profile by ID
  async getStudentById(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching student:", error);
      throw error;
    }
  },
  async getMySessions() {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/student/me`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching student sessions:", error);
      throw error;
    }
  },

  // Get all jobs (public endpoint for students to browse)
  async getAllJobs() {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  },

  // Get company profile by recruiterId
  async getCompanyByRecruiterId(recruiterId) {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${recruiterId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch company");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching company:", error);
      return {};
    }
  },

  // Apply to a job
  async applyToJob(jobId, applicantData) {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/recruiter/jobs/${jobId}/apply`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(applicantData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to apply to job");
      }
      return await response.json();
    } catch (error) {
      console.error("Error applying to job:", error);
      throw error;
    }
  },
};
