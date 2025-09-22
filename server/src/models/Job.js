const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	salary: { type: String },
	type: { type: String, default: 'Full-time' },
	location: { type: String, default: 'Remote' },
	postedAt: { type: Date, default: Date.now },
	companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
	recruiterId: { type: mongoose.Schema.Types.ObjectId },
	applicantsCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Job', JobSchema);


