const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

// Company
router.get('/company', async (req, res) => {
	const recruiterId = req.user?._id || null;
	const company = await Company.findOne(recruiterId ? { recruiterId } : {}).lean();
	return res.json(company || {});
});

router.post('/company', async (req, res) => {
	const recruiterId = req.user?._id || null;
	const payload = { ...req.body, recruiterId };
	let company = await Company.findOne(recruiterId ? { recruiterId } : {});
	if (!company) company = new Company(payload); else Object.assign(company, payload);
	await company.save();
	return res.json(company);
});

// Jobs
router.get('/jobs', async (_req, res) => {
	const jobs = await Job.find({}).sort({ postedAt: -1 }).lean();
	return res.json(jobs);
});

router.post('/jobs', async (req, res) => {
	const recruiterId = req.user?._id || null;
	const job = new Job({ ...req.body, recruiterId });
	await job.save();
	return res.json(job);
});

// Applications
router.get('/jobs/:jobId/applicants', async (req, res) => {
	const list = await Application.find({ jobId: req.params.jobId }).sort({ appliedAt: -1 }).lean();
	return res.json(list);
});

router.post('/jobs/:jobId/apply', async (req, res) => {
	const { name, email, resumeUrl } = req.body || {};
	if (!name || !email || !resumeUrl) return res.status(400).json({ message: 'Missing fields' });
	const job = await Job.findById(req.params.jobId);
	if (!job) return res.status(404).json({ message: 'Job not found' });
	const application = new Application({ jobId: job._id, name, email, resumeUrl });
	await application.save();
	job.applicantsCount = (job.applicantsCount || 0) + 1;
	await job.save();
	return res.json({ success: true, applicationId: application._id });
});

// Update application status
router.post('/applications/:appId/status', async (req, res) => {
	const { status } = req.body || {};
	if (!['applied','shortlisted','rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
	const app = await Application.findById(req.params.appId);
	if (!app) return res.status(404).json({ message: 'Application not found' });
	app.status = status;
	await app.save();
	return res.json({ success: true });
});

// List applications by candidate email (for student view)
router.get('/applications/by-email/:email', async (req, res) => {
	const email = req.params.email;
	const apps = await Application.find({ email }).sort({ appliedAt: -1 }).lean();
	return res.json(apps);
});

module.exports = router;


