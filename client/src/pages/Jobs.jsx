import React, { useEffect, useState } from "react";
import { recruiterService } from "../services/recruiterService";

export default function Jobs() {
	const [jobs, setJobs] = useState([]);
	const [company, setCompany] = useState(null);
	const [loading, setLoading] = useState(true);
	const [applying, setApplying] = useState(null); // jobId
	const [form, setForm] = useState({ name: "", email: "", resumeUrl: "" });

	useEffect(() => {
		(async () => {
			const [j, c] = await Promise.all([
				recruiterService.getJobs(),
				recruiterService.getCompanyProfile()
			]);
			setJobs(Array.isArray(j) ? j : []);
			setCompany(c);
			setLoading(false);
		})();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-gray-600">Loading jobs...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-10">
			<div className="max-w-6xl mx-auto px-4">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">Open Positions</h1>
				{company && (
					<div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-1">{company.name || 'Company'}</h2>
						<p className="text-gray-600">{company.address}</p>
						<div className="mt-2 text-sm text-gray-600">Size: {company.size || '—'} • Founded: {company.founded || '—'}</div>
					</div>
				)}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{jobs.map((job) => (
						<div key={job._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
							<h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
							<p className="text-gray-600 mt-1">{job.location || 'Remote'} • {job.type || 'Full-time'}</p>
							<p className="text-gray-700 mt-3">{job.description}</p>
							<div className="mt-3 text-sm text-gray-600">Salary: {job.salary || 'Not specified'}</div>
							<div className="mt-4 flex justify-between items-center">
								<span className="text-sm text-gray-500">{new Date(job.postedAt || Date.now()).toLocaleDateString()}</span>
								<button onClick={() => { setApplying(job._id); setForm({ name: "", email: "", resumeUrl: "" }); }} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Apply</button>
							</div>
						</div>
					))}
					{jobs.length === 0 && <div className="text-gray-600">No jobs posted yet.</div>}
				</div>

				{/* Apply Modal */}
				{applying && (
					<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
						<div className="bg-white rounded-2xl p-6 w-full max-w-md">
							<h3 className="text-xl font-bold text-gray-900 mb-4">Apply to Job</h3>
							<div className="space-y-3">
								<input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Your full name" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
								<input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
								<input value={form.resumeUrl} onChange={(e)=>setForm({...form,resumeUrl:e.target.value})} placeholder="Resume URL (Google Drive/Link)" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
							</div>
							<div className="mt-5 flex justify-end gap-2">
								<button onClick={()=>setApplying(null)} className="px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
								<button onClick={async ()=>{ await recruiterService.applyToJob(applying, form); setApplying(null); alert('Applied!'); }} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Submit</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}


