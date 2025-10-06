const API_BASE = "http://localhost:3000/api/recruiter";

// Helper function to get auth headers with JWT token
function getAuthHeaders() {
	const token = localStorage.getItem("token");
	return {
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
	};
}

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
		try { const res = await fetch(`${API_BASE}/company`, { headers: getAuthHeaders() }); return await toJson(res); }
		catch (_e) { return { name: '', address: '', size: '', founded: '' }; }
	},
	async saveCompanyProfile(profile) {
		try { const res = await fetch(`${API_BASE}/company`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(profile) }); return await toJson(res); }
		catch (_e) { throw new Error('Failed to save company profile'); }
	},
	async getJobs() {
		try { const res = await fetch(`${API_BASE}/jobs`, { headers: getAuthHeaders() }); return await toJson(res); }
		catch (_e) { return []; }
	},
	async createJob(job) {
		try { const res = await fetch(`${API_BASE}/jobs`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(job) }); return await toJson(res); }
		catch (_e) { throw new Error('Failed to create job'); }
	},
	async getApplicants(jobId) {
		try { const res = await fetch(`${API_BASE}/jobs/${jobId}/applicants`, { headers: getAuthHeaders() }); return await toJson(res); }
		catch (_e) { return []; }
	},
	async applyToJob(jobId, applicant) {
		try { const res = await fetch(`${API_BASE}/jobs/${jobId}/apply`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(applicant) }); return await toJson(res); }
		catch (_e) { throw new Error('Failed to apply to job'); }
	}
,
	async updateApplicationStatus(appId, status) {
		const res = await fetch(`${API_BASE}/applications/${appId}/status`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ status }) });
		return toJson(res);
	},
	async getApplicationsByEmail(email) {
		const res = await fetch(`${API_BASE}/applications/by-email/${encodeURIComponent(email)}`, { headers: getAuthHeaders() });
		return toJson(res);
	}
};


