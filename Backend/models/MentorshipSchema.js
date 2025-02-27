const MentorshipSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionDate: { type: Date, required: true },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Mentorship', MentorshipSchema);
