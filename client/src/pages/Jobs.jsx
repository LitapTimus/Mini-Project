import React, { useEffect, useState } from "react";
import { studentService } from "../services/studentService";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Send,
  X,
  Search,
  Filter,
  Sparkles,
  Calendar,
} from "lucide-react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", resumeUrl: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    (async () => {
      const jobs = await studentService.getAllJobs();
      setJobs(Array.isArray(jobs) ? jobs : []);
      setLoading(false);
    })();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || job.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">
            Loading opportunities...
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Career Opportunities
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Career
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exciting opportunities at top companies and take the next
            step in your professional journey
          </p>
        </div>


        {/* Search and Filter */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white min-w-[140px]"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Intern">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredJobs.length} position
              {filteredJobs.length !== 1 ? "s" : ""} available
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="h-4 w-4" />
              <span>Updated daily</span>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredJobs.map((job) => (
            <div key={job._id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>

              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location || "Remote"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{job.type || "Full-time"}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(
                        job.postedAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 line-clamp-3">
                  {job.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">
                      Actively hiring
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setApplying(job._id);
                      setForm({ name: "", email: "", resumeUrl: "" });
                    }}
                    className="group/btn relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-green-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Apply Now
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new
              opportunities.
            </p>
          </div>
        )}

        {/* Apply Modal */}
        {applying && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-20"></div>

              <div className="relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Apply for Position
                  </h3>
                  <button
                    onClick={() => setApplying(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="Enter your email"
                      type="email"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume URL
                    </label>
                    <input
                      value={form.resumeUrl}
                      onChange={(e) =>
                        setForm({ ...form, resumeUrl: e.target.value })
                      }
                      placeholder="Google Drive link or portfolio URL"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setApplying(null)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await studentService.applyToJob(applying, form);
                        setApplying(null);
                        alert("Application submitted successfully!");
                      } catch (error) {
                        alert(error.message || "Failed to submit application");
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
