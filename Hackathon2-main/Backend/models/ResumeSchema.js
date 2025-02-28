const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: [{
        company: String,
        position: String,
        duration: String
    }],
    education: [{
        institution: String,
        degree: String,
        year: String
    }],
    parsedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", ResumeSchema);
