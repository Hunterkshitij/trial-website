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


// --- 3. Schemas & Models (Paste this BELOW the requires) ---
const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
  education: { type: String, required: true },
  github: { type: String },
  linkedin: { type: String, required: true },
  experience: { type: String },
  appliedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

// Newsletter subscribers (wired to the footer "Subscribe us" form)
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Contact / project inquiries (wired to the "Contact Us" modal form)
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);


// --- 4. Routes ---

// Health check — also useful to "warm up" the free-tier dyno before a user submits a form.
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Anisur International API' });
});

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

app.post('/api/subscribe', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    console.log("📧 New newsletter subscription:", email);
    await Subscriber.create({ email });
    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (error) {
    // Duplicate email — treat as success so the user isn't shown an error for re-subscribing.
    if (error && error.code === 11000) {
      return res.status(200).json({ message: "You are already subscribed!" });
    }
    console.error("❌ Error saving subscriber:", error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    console.log("📨 Received new contact inquiry:", req.body);

    const newContact = new Contact(req.body);
    await newContact.save();

    res.status(201).json({ message: "Message received! We will get back to you shortly." });
  } catch (error) {
    console.error("❌ Error saving contact inquiry:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// --- 5. Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
