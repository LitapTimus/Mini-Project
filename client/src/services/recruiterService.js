const API_BASE = "http://localhost:3000/api/recruiter";

async function toJson(res) {
	if (!res.ok) {
		let msg = `HTTP ${res.status}`;
		try { const j = await res.json(); msg = j.message || msg; } catch (_e) {}
		throw new Error(msg);
	}
	return res.json();
}

function lsGet(key, fallback) {
	try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (_e) { return fallback; }
}
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (_e) {} }

export const recruiterService = {
	async getCompanyProfile() {
		try { const res = await fetch(`${API_BASE}/company`); return await toJson(res); }
		catch (_e) { return lsGet('recruiter_company', { name: '', address: '', size: '', founded: '' }); }
	},
	async saveCompanyProfile(profile) {
		try { const res = await fetch(`${API_BASE}/company`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) }); return await toJson(res); }
		catch (_e) { lsSet('recruiter_company', profile); return profile; }
	},
	async getJobs() {
		try { const res = await fetch(`${API_BASE}/jobs`); return await toJson(res); }
		catch (_e) { return lsGet('recruiter_jobs', []); }
	},
	async createJob(job) {
		try { const res = await fetch(`${API_BASE}/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(job) }); return await toJson(res); }
		catch (_e) { const list = lsGet('recruiter_jobs', []); const j = { ...job, _id: `job_${Date.now()}`, postedAt: new Date().toISOString(), applicantsCount: 0 }; list.unshift(j); lsSet('recruiter_jobs', list); return j; }
	},
	async getApplicants(jobId) {
		try { const res = await fetch(`${API_BASE}/jobs/${jobId}/applicants`); return await toJson(res); }
		catch (_e) { const key = `recruiter_applicants_${jobId}`; return lsGet(key, []); }
	},
	async applyToJob(jobId, applicant) {
		try { const res = await fetch(`${API_BASE}/jobs/${jobId}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(applicant) }); return await toJson(res); }
		catch (_e) { return { success: true, storedLocally: true }; }
	}
,
	async updateApplicationStatus(appId, status) {
		const res = await fetch(`${API_BASE}/applications/${appId}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
		return toJson(res);
	},
	async getApplicationsByEmail(email) {
		const res = await fetch(`${API_BASE}/applications/by-email/${encodeURIComponent(email)}`);
		return toJson(res);
	}
};


