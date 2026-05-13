require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Models (Matching your exact lowercase filenames)
const User = require('./models/user');
const Inquiry = require('./models/inquiry');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ Database connection error:', err));

// ==========================================
// API ENDPOINTS
// ==========================================

// Submit Inquiry Form Endpoint
app.post('/api/inquiry', async (req, res) => {
  try {
    console.log("Data received:", req.body); // This will show up in your Render logs!
    const { name, email, courseInterest, message } = req.body;
    const newInquiry = new Inquiry({ name, email, courseInterest, message });
    await newInquiry.save();
    res.status(201).json({ message: 'Information received successfully.' });
  } catch (error) {
    console.error("Database Save Error:", error); // This tells us EXACTLY why it failed
    res.status(500).json({ message: 'Error submitting form' });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));