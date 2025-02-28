import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import Navbar from "./Navbar";

export default function SkillAssessment() {
  const [skill, setSkill] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  // Fetch Questions (MCQs)
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/generate-questions", { skill });

      // Exclude the first (0th) and last question
      const filteredQuestions = response.data.questions.slice(1, -1);

      setQuestions(filteredQuestions);
      setAnswers(new Array(filteredQuestions.length).fill("")); // Initialize answers
    } catch (error) {
      console.error("Error fetching questions", error);
    }
    setLoading(false);
  };

  // Submit Answers
  const submitAnswers = async () => {
    if (!answers || answers.length === 0) {
      console.error("Answers array is empty or undefined");
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting:", { userId: user._id, skill, answers });

      const response = await axios.post("/evaluate", {
        userId: user._id,
        skill,
        answers,
      });

      console.log("Response received:", response.data);
      setLevel(response.data.level);
    } catch (error) {
      console.error("Error submitting answers:", error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Skill Assessment
        </h1>

        {/* Skill Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter a skill (e.g., JavaScript)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchQuestions}
            disabled={loading || !skill.trim()}
            className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
          >
            {loading ? "Generating Questions..." : "Generate Questions"}
          </button>
        </div>

        {/* MCQ Questions */}
        {questions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Answer the Questions:
            </h2>
            {questions.map((q, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition duration-300"
              >
                <p className="font-medium text-gray-800">{q.question}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((option, optionIndex) => {
                    const optionLetter = String.fromCharCode(65 + optionIndex); // Convert 0 → 'A', 1 → 'B'...
                    return (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionLetter}
                          checked={answers[index] === optionLetter}
                          onChange={() => {
                            const newAnswers = [...answers];
                            newAnswers[index] = optionLetter;
                            setAnswers(newAnswers);
                          }}
                          className="form-radio h-5 w-5 text-blue-500"
                        />
                        <span className="text-gray-700">
                          {optionLetter}. {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={submitAnswers}
              disabled={loading || answers.some((a) => !a)}
              className="w-full mt-6 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-green-300"
            >
              {loading ? "Submitting..." : "Submit Answers"}
            </button>
          </div>
        )}

        {/* Display Level */}
        {level && (
          <div className="mt-8 p-6 bg-blue-50 text-center rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-800">
              Your Skill Level:{" "}
              <span className="text-blue-600">{level}</span>
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}