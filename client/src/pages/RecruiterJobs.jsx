import React, { useEffect, useState } from "react";
import { recruiterService } from "../services/recruiterService";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", salary: "", type: "Full-time", location: "Remote" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const list = await recruiterService.getJobs();
    setJobs(Array.isArray(list) ? list : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.title || !form.description) { alert("Please fill title and description"); return; }
    setSaving(true);
    await recruiterService.createJob(form);
    setForm({ title: "", description: "", salary: "", type: "Full-time", location: "Remote" });
    await load();
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Jobs</h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Job title" className="border border-gray-300 rounded-lg px-3 py-2" />
            <input value={form.salary} onChange={(e)=>setForm({...form,salary:e.target.value})} placeholder="Salary (e.g. 8-12 LPA)" className="border border-gray-300 rounded-lg px-3 py-2" />
            <input value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})} placeholder="Type (Full-time/Intern)" className="border border-gray-300 rounded-lg px-3 py-2" />
            <input value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} placeholder="Location" className="border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Description" className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 h-28" />
          <div className="mt-4 flex justify-end">
            <button onClick={submit} disabled={saving} className={`px-5 py-2 rounded-lg text-white ${saving? 'bg-gray-400':'bg-blue-600 hover:bg-blue-700'}`}>{saving? 'Posting...':'Post Job'}</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Posted Jobs</h2>
          {loading ? (<div className="text-gray-600">Loading...</div>) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map(job => (
                <div key={job._id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-600">{job.location || 'Remote'} • {job.type || 'Full-time'}</div>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(job.postedAt).toLocaleDateString()}</div>
                  </div>
                  <p className="mt-2 text-gray-700 line-clamp-3">{job.description}</p>
                  <div className="mt-3 text-sm text-gray-600">Salary: {job.salary || '—'}</div>
                  <div className="mt-2 text-sm text-gray-700">Applicants: {job.applicantsCount || 0}</div>
                </div>
              ))}
              {jobs.length === 0 && <div className="text-gray-600">No jobs yet.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


