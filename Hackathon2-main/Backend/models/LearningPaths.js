// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    linkedinProfile: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    skills: [{ type: String }],
    careerGoals: [{ type: String }],
    progress: { type: mongoose.Schema.Types.ObjectId, ref: 'Progress' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);