import React, { useEffect, useState } from "react";
import { recruiterService } from "../services/recruiterService";

export default function RecruiterApplicants() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [updating, setUpdating] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Applicants</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <label className="text-sm text-gray-700">Select Job</label>
          <select value={jobId} onChange={(e)=>setJobId(e.target.value)} className="mt-1 border border-gray-300 rounded-lg px-3 py-2">
            {jobs.map(j => (<option key={j._id} value={j._id}>{j.title}</option>))}
          </select>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {applicants.length === 0 ? (
            <div className="text-gray-600">No applicants yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Resume</th>
                  <th className="p-2">Applied</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(a => (
                  <tr key={a._id} className="border-b">
                    <td className="p-2">{a.name}</td>
                    <td className="p-2">{a.email}</td>
                    <td className="p-2 text-blue-600"><a href={a.resumeUrl} target="_blank" rel="noreferrer">View</a></td>
                    <td className="p-2">{new Date(a.appliedAt).toLocaleString()}</td>
                    <td className="p-2 capitalize">{a.status}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button disabled={updating===a._id} onClick={async ()=>{ setUpdating(a._id); await recruiterService.updateApplicationStatus(a._id,'shortlisted'); setUpdating(null); const list = await recruiterService.getApplicants(jobId); setApplicants(list); }} className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700">Shortlist</button>
                        <button disabled={updating===a._id} onClick={async ()=>{ setUpdating(a._id); await recruiterService.updateApplicationStatus(a._id,'rejected'); setUpdating(null); const list = await recruiterService.getApplicants(jobId); setApplicants(list); }} className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}


