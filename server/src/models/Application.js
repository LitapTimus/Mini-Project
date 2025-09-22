const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
	jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	resumeUrl: { type: String, required: true },
	status: { type: String, default: 'applied' },
	appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', ApplicationSchema);


