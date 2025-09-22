import React, { useEffect, useState } from "react";
import { recruiterService } from "../services/recruiterService";
import {
  Plus,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Loader2,
  CheckCircle,
  Edit3,
  Trash2,
  Eye,
  Target,
  Sparkles,
} from "lucide-react";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    salary: "",
    type: "Full-time",
    location: "Remote",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const list = await recruiterService.getJobs();
    setJobs(Array.isArray(list) ? list : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.title || !form.description) {
      alert("Please fill title and description");
      return;
    }
    setSaving(true);
    await recruiterService.createJob(form);
    setForm({
      title: "",
      description: "",
      salary: "",
      type: "Full-time",
      location: "Remote",
    });
    setShowForm(false);
    await load();
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">
            Loading job listings...
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
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Job Management
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Manage{" "}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Job Listings
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl">
                Create and manage job postings to attract the best talent for
                your organization
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Post New Job
              </span>
            </button>
          </div>
        </div>

        {/* Job Creation Form */}
        {showForm && (
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Create New Job Posting
                    </h2>
                    <p className="text-gray-600">
                      Fill in the details to attract the right candidates
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Job Title */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Briefcase className="h-4 w-4" />
                      Job Title *
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    />
                  </div>

                  {/* Job Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Clock className="h-4 w-4" />
                        Job Type
                      </label>
                      <select
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Intern">Internship</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="h-4 w-4" />
                        Location
                      </label>
                      <input
                        value={form.location}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                        placeholder="e.g., San Francisco, CA or Remote"
                        className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <DollarSign className="h-4 w-4" />
                        Salary Range
                      </label>
                      <input
                        value={form.salary}
                        onChange={(e) =>
                          setForm({ ...form, salary: e.target.value })
                        }
                        placeholder="e.g., $80k - $120k"
                        className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Edit3 className="h-4 w-4" />
                      Job Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Describe the role, responsibilities, requirements, and what makes your company a great place to work..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-y"
                      rows={5}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    disabled={saving || !form.title || !form.description}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                      saving || !form.title || !form.description
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg transform hover:scale-105"
                    } text-white`}
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Posting Job...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Post Job
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.length}
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
                <p className="text-sm font-medium text-gray-600">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.reduce(
                    (sum, job) => sum + (job.applicantsCount || 0),
                    0
                  )}
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
                <p className="text-sm font-medium text-gray-600">
                  Active Listings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Posted Jobs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Job Listings
                </h2>
                <p className="text-gray-600">
                  Manage and monitor your active job postings
                </p>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs posted yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by creating your first job posting to attract talented
                  candidates.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Create First Job
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div key={job._id} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>

                    <div className="relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {job.title}
                          </h3>

                          <div className="flex flex-wrap gap-3 mb-3">
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
                            {new Date(job.postedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                              {job.applicantsCount || 0} applicants
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-green-600 font-medium">
                              Active
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
