import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  MessageCircle,
  Users,
  TrendingUp,
  Clock,
  Award,
  Eye,
  Send,
  Plus,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
} from "lucide-react";

const MentorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Sample mentor data
  const mentor = {
    name: "Dr. Sarah Johnson",
    title: "Senior Software Engineering Mentor",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 4.9,
    totalStudents: 45,
    yearsExperience: 8,
  };

  // Sample students data
  const students = [
    {
      id: 1,
      name: "Alex Chen",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      education: "Computer Science, Stanford",
      skills: ["JavaScript", "React", "Python"],
      interests: ["Web Development", "AI/ML"],
      location: "San Francisco, CA",
      profileCompletion: 85,
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      education: "Business Administration, UCLA",
      skills: ["Marketing", "Analytics", "Strategy"],
      interests: ["Product Management", "Consulting"],
      location: "Los Angeles, CA",
      profileCompletion: 92,
      lastActive: "1 day ago",
      status: "new",
    },
    {
      id: 3,
      name: "David Kim",
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      education: "Data Science, MIT",
      skills: ["Python", "SQL", "Machine Learning"],
      interests: ["Data Science", "Research"],
      location: "Boston, MA",
      profileCompletion: 78,
      lastActive: "3 hours ago",
      status: "active",
    },
    {
      id: 4,
      name: "Emily Zhang",
      avatar:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      education: "Design, RISD",
      skills: ["UI/UX", "Figma", "Prototyping"],
      interests: ["Product Design", "User Research"],
      location: "New York, NY",
      profileCompletion: 95,
      lastActive: "30 minutes ago",
      status: "active",
    },
  ];

  // Sample upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      student: "Alex Chen",
      time: "2:00 PM Today",
      topic: "Career Path Discussion",
      type: "video",
    },
    {
      id: 2,
      student: "Maria Rodriguez",
      time: "10:00 AM Tomorrow",
      topic: "Resume Review",
      type: "video",
    },
    {
      id: 3,
      student: "David Kim",
      time: "3:30 PM Friday",
      topic: "Technical Interview Prep",
      type: "video",
    },
  ];

  // Sample messages
  const recentMessages = [
    {
      id: 1,
      student: "Alex Chen",
      message: "Thank you for the feedback on my portfolio!",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      student: "Emily Zhang",
      message: "Could we schedule a session for next week?",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 3,
      student: "Maria Rodriguez",
      message: "I updated my resume based on your suggestions.",
      time: "1 day ago",
      unread: false,
    },
  ];

  // Summary statistics
  const stats = [
    {
      label: "Total Students",
      value: "45",
      change: "+3",
      icon: Users,
      color: "blue",
    },
    {
      label: "New Students",
      value: "8",
      change: "+2",
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Pending Assessments",
      value: "12",
      change: "-1",
      icon: Award,
      color: "yellow",
    },
    {
      label: "Upcoming Sessions",
      value: "7",
      change: "+1",
      icon: Clock,
      color: "purple",
    },
  ];

  // Domain analytics data
  const domainData = [
    { domain: "Software Engineering", students: 18, avgScore: 4.2 },
    { domain: "Product Management", students: 12, avgScore: 4.0 },
    { domain: "Data Science", students: 8, avgScore: 4.5 },
    { domain: "UX Design", students: 7, avgScore: 4.3 },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      student.interests.some((interest) =>
        interest.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      selectedFilter === "all" || student.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Mentor Portal
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "overview"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "students"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "messages"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "calendar"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Calendar
              </button>
            </nav>

            {/* Profile Menu */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {mentor.name}
                  </p>
                  <p className="text-xs text-gray-500">Mentor</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, Dr. Johnson! 👋
                  </h1>
                  <p className="text-blue-100 text-lg">
                    You have 3 sessions scheduled today and 5 new messages
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-6 text-center">
                  <div>
                    <div className="text-2xl font-bold">{mentor.rating}</div>
                    <div className="text-blue-100 text-sm">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {mentor.totalStudents}
                    </div>
                    <div className="text-blue-100 text-sm">Students</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {mentor.yearsExperience}
                    </div>
                    <div className="text-blue-100 text-sm">Years Exp.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            stat.change.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change} this week
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Domain Analytics */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Student Domain Distribution
                </h2>
                <div className="space-y-4">
                  {domainData.map((domain, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {domain.domain}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {domain.students} students
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">
                            {domain.avgScore}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Avg. Score</p>
                      </div>
                      <div className="ml-4 w-24">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(domain.students / 45) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Upcoming Sessions
                  </h2>
                  <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {session.student}
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {session.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {session.topic}
                      </p>
                      <p className="text-xs text-gray-500">{session.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Messages
                </h2>
                <button
                  onClick={() => setActiveTab("messages")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentMessages.slice(0, 3).map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          {message.student}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {message.message}
                      </p>
                    </div>
                    {message.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search students by name, skills, or interests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Students</option>
                  <option value="active">Active</option>
                  <option value="new">New Students</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {student.education}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {student.location}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === "new"
                          ? "bg-green-100 text-green-800"
                          : student.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Profile Completion</span>
                      <span className="font-medium">
                        {student.profileCompletion}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${student.profileCompletion}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{student.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    Last active: {student.lastActive}
                  </p>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Eye className="w-4 h-4 inline mr-1" />
                      View
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      <MessageCircle className="w-4 h-4 inline mr-1" />
                      Message
                    </button>
                  </div>

                  <div className="flex space-x-2 mt-2">
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Schedule
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      <Award className="w-4 h-4 inline mr-1" />
                      Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No students found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Messages & Notifications
            </h2>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {message.student}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{message.message}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Send className="w-4 h-4 inline mr-1" />
                      Reply
                    </button>
                  </div>
                  {message.unread && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Calendar & Sessions
              </h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-4 h-4 inline mr-2" />
                Schedule Session
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Upcoming Sessions
                </h3>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {session.student}
                        </h4>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {session.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {session.topic}
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        {session.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Schedule New Session
                  </button>
                  <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    <Clock className="w-5 h-5 inline mr-2" />
                    Set Availability
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <Settings className="w-5 h-5 inline mr-2" />
                    Calendar Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
