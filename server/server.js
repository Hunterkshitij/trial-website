// 1. Create a Schema & Model for Job Applications 
// (You can also move this into a separate file in your 'models' folder later!)
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

// 2. The Route to catch the React Form Submission
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