const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    skillsRequired: [{ type: String }],
    link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);