// server/models/Inquiry.js
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  courseInterest: { type: String, enum: ['English', 'Computer', 'Other'], required: true },
  message: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);