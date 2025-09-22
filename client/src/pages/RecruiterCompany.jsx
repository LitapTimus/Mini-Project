import React, { useEffect, useState } from "react";
import { recruiterService } from "../services/recruiterService";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Save,
  Loader2,
  CheckCircle,
  Info,
  Sparkles,
} from "lucide-react";

export default function RecruiterCompany() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    size: "",
    founded: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await recruiterService.getCompanyProfile();
      if (c)
        setForm({
          name: c.name || "",
          address: c.address || "",
          size: c.size || "",
          founded: c.founded || "",
        });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    if (!form.name) {
      alert("Company name is required");
      return;
    }
    setSaving(true);
    setSaved(false);
    await recruiterService.saveCompanyProfile(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">
            Loading company profile...
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

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Company Management
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Company{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build your company profile to attract top talent and showcase your
            organization
          </p>
        </div>

        {/* Info Card */}
        <div className="mb-8 bg-blue-50/50 backdrop-blur-sm rounded-2xl border border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Complete your profile
              </h3>
              <p className="text-blue-700 text-sm">
                A complete company profile helps candidates understand your
                organization better and increases application rates by up to
                40%.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Company Information
                </h2>
                <p className="text-gray-600">
                  Update your company details and information
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Building2 className="h-4 w-4" />
                  Company Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your company name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MapPin className="h-4 w-4" />
                  Company Address
                </label>
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Enter company address (e.g., San Francisco, CA)"
                  className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Company Size and Founded Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Users className="h-4 w-4" />
                    Company Size
                  </label>
                  <select
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="h-4 w-4" />
                    Founded Year
                  </label>
                  <input
                    value={form.founded}
                    onChange={(e) =>
                      setForm({ ...form, founded: e.target.value })
                    }
                    placeholder="e.g., 2010"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-10 flex justify-end">
              <button
                onClick={save}
                disabled={saving || !form.name}
                className={`group relative overflow-hidden px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  saving || !form.name
                    ? "bg-gray-400 cursor-not-allowed"
                    : saved
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-xl"
                } text-white`}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-3">
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving Profile...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Profile Saved!
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Profile
                      <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Completion Status */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">
            Profile Completion
          </h3>

          <div className="space-y-3">
            {[
              { field: "name", label: "Company Name", completed: !!form.name },
              {
                field: "address",
                label: "Company Address",
                completed: !!form.address,
              },
              { field: "size", label: "Company Size", completed: !!form.size },
              {
                field: "founded",
                label: "Founded Year",
                completed: !!form.founded,
              },
            ].map((item) => (
              <div key={item.field} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.completed ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {item.completed && (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    item.completed ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            {(() => {
              const completed = [
                form.name,
                form.address,
                form.size,
                form.founded,
              ].filter(Boolean).length;
              const percentage = (completed / 4) * 100;
              return (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Profile Completion
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
