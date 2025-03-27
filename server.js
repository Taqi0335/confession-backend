const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const Confession = require("./models/Confessions");

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Ensure MongoDB URI is set
if (!MONGO_URI) {
  console.error("❌ MongoDB URI is missing in .env file");
  process.exit(1);
}

// ✅ CORS setup (Environment variable for security)
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));

app.use(express.json()); // Parse JSON
app.use(morgan("dev"));  // Logs requests

// ✅ GET route to fetch all confessions
app.get("/confessions", async (req, res) => {
  try {
    const confessions = await Confession.find();
    res.json(confessions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving confessions" });
  }
});

// ✅ POST route to submit confessions
app.post("/confessions", async (req, res) => {
  try {
    const { name, confession } = req.body;

    if (!name?.trim() || !confession?.trim()) {
      return res.status(400).json({ message: "Name and confession are required." });
    }

    const newConfession = new Confession({ name, confession });
    await newConfession.save();

    res.status(201).json({ message: "Confession submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again later." });
  }
});

// ✅ DELETE route to remove a confession
app.delete("/confessions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConfession = await Confession.findByIdAndDelete(id);

    if (!deletedConfession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    res.json({ message: "Confession deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting confession" });
  }
});

// ✅ MongoDB Connection & Server Start
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
