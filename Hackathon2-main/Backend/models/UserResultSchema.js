const mongoose = require("mongoose");

const UserResultSchema = new mongoose.Schema({
  userId: String,
  skill: String,
  score: Number,
  level: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserResult", UserResultSchema);
