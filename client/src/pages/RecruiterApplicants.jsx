import React, { useEffect, useState } from "react";
import { recruiterService } from "../services/recruiterService";
import {
  Users,
  Mail,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Filter,
  Download,
  Eye,
  Loader2,
} from "lucide-react";

export default function RecruiterApplicants() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [updating, setUpdating] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    (async () => {
      const list = await recruiterService.getJobs();
      setJobs(Array.isArray(list) ? list : []);
      if (list && list[0]) setJobId(list[0]._id);
    })();
  }, []);

  useEffect(() => {
    if (!jobId) return;
    (async () => {
      const list = await recruiterService.getApplicants(jobId);
      setApplicants(Array.isArray(list) ? list : []);
    })();
  }, [jobId]);

  const filteredApplicants = applicants.filter((applicant) => {
    if (filterStatus === "all") return true;
    return applicant.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const updateStatus = async (applicantId, status) => {
    setUpdating(applicantId);
    await recruiterService.updateApplicationStatus(applicantId, status);
    setUpdating(null);
    const list = await recruiterService.getApplicants(jobId);
    setApplicants(list);
  };

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
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Talent Management
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Review{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Applicants
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl">
            Manage and review applications from talented candidates for your
            open positions
          </p>
        </div>

        {/* Job Selection Card */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Position
                </label>
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full max-w-md border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {applicants.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Applications
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 shadow-lg">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filter by status:
              </span>

              <div className="flex gap-2">
                {["all", "pending", "shortlisted", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filterStatus === status
                        ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              <div className="ml-auto text-sm text-gray-600">
                Showing {filteredApplicants.length} of {applicants.length}{" "}
                applications
              </div>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No applicants found
              </h3>
              <p className="text-gray-600">
                {filterStatus === "all"
                  ? "No applications received yet."
                  : `No ${filterStatus} applications.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Candidate
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Resume
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Applied
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplicants.map((applicant) => (
                    <tr
                      key={applicant._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {applicant.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {applicant.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{applicant.email}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <a
                          href={applicant.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            View Resume
                          </span>
                          <Eye className="h-3 w-3" />
                        </a>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(applicant.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            applicant.status
                          )}`}
                        >
                          {applicant.status === "shortlisted" && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {applicant.status === "rejected" && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {applicant.status === "pending" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {applicant.status.charAt(0).toUpperCase() +
                            applicant.status.slice(1)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            disabled={updating === applicant._id}
                            onClick={() =>
                              updateStatus(applicant._id, "shortlisted")
                            }
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {updating === applicant._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            Shortlist
                          </button>

                          <button
                            disabled={updating === applicant._id}
                            onClick={() =>
                              updateStatus(applicant._id, "rejected")
                            }
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {updating === applicant._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {applicants.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                label: "Total Applications",
                count: applicants.length,
                color: "from-blue-500 to-blue-600",
                icon: Users,
              },
              {
                label: "Pending Review",
                count: applicants.filter((a) => a.status === "pending").length,
                color: "from-yellow-500 to-yellow-600",
                icon: Clock,
              },
              {
                label: "Shortlisted",
                count: applicants.filter((a) => a.status === "shortlisted")
                  .length,
                color: "from-green-500 to-green-600",
                icon: CheckCircle,
              },
              {
                label: "Rejected",
                count: applicants.filter((a) => a.status === "rejected").length,
                color: "from-red-500 to-red-600",
                icon: XCircle,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.count}
                    </p>
                  </div>
                  <div
                    className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
