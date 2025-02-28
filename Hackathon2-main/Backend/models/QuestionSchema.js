const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
    skill: String,
    question: String,
    answer: String,
  });
  module.exports = mongoose.model('Question', QuestionSchema);