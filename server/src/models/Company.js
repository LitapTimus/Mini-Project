const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
	name: { type: String, required: true },
	address: { type: String },
	size: { type: String },
	founded: { type: String },
	recruiterId: { type: mongoose.Schema.Types.ObjectId },
});

module.exports = mongoose.model('Company', CompanySchema);


