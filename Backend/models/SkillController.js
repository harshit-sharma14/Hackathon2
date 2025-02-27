const Question = require("../models/Question");
const UserResult = require("../models/UserResult");
const { generateQuestions } = require("../utils/openaiService");

// Generate and save questions
exports.generateSkillQuestions = async (req, res) => {
  const { skill } = req.body;

  if (!skill) return res.status(400).json({ error: "Skill is required" });

  try {
    const questions = await generateQuestions(skill);
    if (!questions) return res.status(500).json({ error: "Failed to generate questions" });

    const formattedQuestions = questions.split("\n").reduce((acc, line, index) => {
      if (line.startsWith("Q")) acc.push({ question: line.substring(3) });
      if (line.startsWith("A")) acc[acc.length - 1].answer = line.substring(3);
      return acc;
    }, []);

    await Question.insertMany(formattedQuestions.map(q => ({ skill, ...q })));

    res.status(200).json({ success: true, questions: formattedQuestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Evaluate User Answers
exports.evaluateAnswers = async (req, res) => {
  const { userId, skill, answers } = req.body;

  if (!userId || !skill || !answers) return res.status(400).json({ error: "Missing data" });

  try {
    const questions = await Question.find({ skill });

    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index].trim().toLowerCase() === q.answer.trim().toLowerCase()) correctCount++;
    });

    let level;
    if (correctCount <= 3) level = "Beginner";
    else if (correctCount <= 6) level = "Intermediate";
    else if (correctCount <= 8) level = "Advanced";
    else level = "Expert";

    const userResult = new UserResult({ userId, skill, score: correctCount, level });
    await userResult.save();

    res.status(200).json({ success: true, level, correctCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
