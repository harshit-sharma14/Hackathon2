const  mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
    content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);