const mongoose = require("mongoose");

const ConfessionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    confession: { type: String, required: true } // ✅ Make sure it's `confession`
});

module.exports = mongoose.model("Confession", ConfessionSchema);