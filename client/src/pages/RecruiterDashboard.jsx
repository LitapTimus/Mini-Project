import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterService } from "../services/recruiterService";
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Plus,
  Building2,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    jobs: [],
    totalApplicants: 0,
    company: null,
    recentApplicants: [],
  });

  useEffect(() => {
    // Check for OAuth callback parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (token && userParam) {
      // Store token and user data from OAuth callback
      localStorage.setItem('token', token);
      localStorage.setItem('user', userParam);
      localStorage.setItem('selectedRole', 'recruiter');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch jobs and company data
      const [jobs, company] = await Promise.all([
        recruiterService.getJobs(),
        recruiterService.getCompanyProfile(),
      ]);

      // Get applicants for all jobs
      let totalApplicants = 0;
      let recentApplicants = [];

      if (jobs && jobs.length > 0) {
        for (const job of jobs) {
          try {
            const applicants = await recruiterService.getApplicants(job._id);
            if (applicants && Array.isArray(applicants)) {
              totalApplicants += applicants.length;
              // Add job title to each applicant and collect recent ones
              const applicantsWithJob = applicants.map((app) => ({
                ...app,
                jobTitle: job.title,
              }));
              recentApplicants.push(...applicantsWithJob);
            }
          } catch (error) {
            // Error fetching applicants for job - silently continue to next job
          }
        }
      }

      // Sort recent applicants by application date
      recentApplicants.sort(
        (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
      );
      recentApplicants = recentApplicants.slice(0, 5); // Get latest 5

      setDashboardData({
        jobs: Array.isArray(jobs) ? jobs : [],
        totalApplicants,
        company,
        recentApplicants,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "shortlisted":
        return "text-green-600 bg-green-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "shortlisted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-bl from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Modern Navbar */}
      <nav className="relative bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                CareerCompass
              </h1>
              {dashboardData.company?.name && (
                <span className="text-sm text-gray-500">
                  • {dashboardData.company.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/recruiter/jobs")}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Post Job
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Recruiter Dashboard
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Recruiter
            </span>
          </h1>

          <p className="text-xl text-gray-600">
            Manage your job postings and review applications from top talent
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 shadow-lg sticky top-8">
              <h2 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Quick Actions
              </h2>
              <ul className="space-y-3">
                {[
                  { label: "Dashboard", path: "/dashboard", icon: Activity },
                  {
                    label: "Posted Jobs",
                    path: "/recruiter/jobs",
                    icon: Briefcase,
                  },
                  {
                    label: "Applicants",
                    path: "/recruiter/applicants",
                    icon: Users,
                  },
                  {
                    label: "Company Profile",
                    path: "/recruiter/company",
                    icon: Building2,
                  },
                ].map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:border-blue-200 border border-transparent transition-all group"
                    >
                      <item.icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                      <span className="text-gray-700 group-hover:text-blue-700 font-medium">
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">
                      Jobs Posted
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {dashboardData.jobs.length}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Applicants
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {dashboardData.totalApplicants}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">
                      Active Listings
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {dashboardData.jobs.length}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Job Posts */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  Recent Job Posts
                </h2>
                <button
                  onClick={() => navigate("/recruiter/jobs")}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                  View All
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>

              {dashboardData.jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No jobs posted yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by posting your first job to attract talented
                    candidates.
                  </p>
                  <button
                    onClick={() => navigate("/recruiter/jobs")}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.jobs.slice(0, 3).map((job) => (
                    <div
                      key={job._id}
                      className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Posted {new Date(job.postedAt).toLocaleDateString()} •{" "}
                          {job.applicantsCount || 0} applicants
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {job.type || "Full-time"}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {job.location || "Remote"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/recruiter/applicants")}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Applicants */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="h-6 w-6 text-green-600" />
                  Recent Applicants
                </h2>
                <button
                  onClick={() => navigate("/recruiter/applicants")}
                  className="text-green-600 hover:text-green-800 font-medium flex items-center gap-2"
                >
                  View All
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>

              {dashboardData.recentApplicants.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No applications yet
                  </h3>
                  <p className="text-gray-600">
                    Applications will appear here once candidates start applying
                    to your jobs.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Candidate
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Position
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Applied
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dashboardData.recentApplicants.map(
                        (applicant, index) => (
                          <tr
                            key={applicant._id || index}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {applicant.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-900">
                                  {applicant.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {applicant.jobTitle}
                            </td>
                            <td className="px-4 py-4 text-gray-600 text-sm">
                              {new Date(
                                applicant.appliedAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  applicant.status
                                )}`}
                              >
                                {getStatusIcon(applicant.status)}
                                {applicant.status.charAt(0).toUpperCase() +
                                  applicant.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() =>
                                  navigate("/recruiter/applicants")
                                }
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
