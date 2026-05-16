const express = require('express');
const mongoose = require('mongoose'); // <-- This MUST be here, before the schema!
const cors = require('cors');
require('dotenv').config(); // Assuming you are using dotenv for your Atlas URI

const app = express();

// --- 1. Middleware ---
app.use(cors());
app.use(express.json());

// --- 2. Database Connection ---
// (Your existing MongoDB connection code should be here)
mongoose.connect(process.env.MONGO_URI || 'your_mongodb_connection_string')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// --- 3. The New Schema & Model (Paste this BELOW the requires) ---
const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
  education: { type: String, required: true },
  github: { type: String },
  linkedin: { type: String, required: true },
  experience: { type: String },
  appliedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);


// --- 4. The Route ---
app.post('/api/apply', async (req, res) => {
  try {
    console.log("📥 Received new job application:", req.body);
    
    // Save to MongoDB
    const newApplication = new Application(req.body);
    await newApplication.save();

    res.status(201).json({ message: "Application successfully saved to MongoDB!" });
  } catch (error) {
    console.error("❌ Error saving application:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// --- 5. Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

