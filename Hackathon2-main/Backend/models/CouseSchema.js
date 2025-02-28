const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    skillsCovered: [{ type: String }],
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);