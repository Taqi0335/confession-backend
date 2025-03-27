const express = require("express");
const Confession = require("../models/Confessions");
const { Parser } = require("json2csv");

const router = express.Router();

// Store confession
router.post("/", async (req, res) => {
  try {
    const { name, confession } = req.body; // Use "text" instead of "confession"
    
    // Validate confession text
    if (!confession || !confession.trim()) {
      return res.status(400).json({ message: "Confession cannot be empty" });
    }

    // Optional: Validate name (if required)
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const newConfession = new Confession({ name, text: confession });
    await newConfession.save();

    res.status(201).json({ message: "Confession submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting confession", error: error.message });
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});


// Export all confessions as CSV
router.get("/export", async (req, res) => {
  try {
    const confessions = await Confession.find({}, "text createdAt");
    const csvParser = new Parser({ fields: ["text", "createdAt"] });
    const csvData = csvParser.parse(confessions);

    res.setHeader("Content-Disposition", "attachment; filename=confessions.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csvData);
  } catch (error) {
    res.status(500).json({ message: "Error exporting confessions", error: error.message });
  }
});

module.exports = router;