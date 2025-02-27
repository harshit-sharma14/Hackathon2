const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    points: { type: Number, default: 0 },
    leaderboardRank: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);