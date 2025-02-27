import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function SkillAssessment() {
  const [skill, setSkill] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(false);
 const { user,setUser } = useContext(UserContext);
  // Fetch Questions (MCQs)
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/generate-questions", { skill });
      console.log(response.data);
  
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Skill Assessment</h1>
      
      {/* Skill Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter a skill (e.g., JavaScript)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <button
          onClick={fetchQuestions}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg"
        >
          Generate Questions
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* MCQ Questions */}
      {questions.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Answer the Questions:</h2>
          {questions.map((q, index) => (
            <div key={index} className="mb-4 p-3 border rounded-lg">
              <p className="font-medium">{q.question}</p>
              <div className="mt-2">
                {q.options.map((option, optionIndex) => {
                  const optionLetter = String.fromCharCode(65 + optionIndex); // Convert 0 → 'A', 1 → 'B'...
                  return (
                    <label key={optionIndex} className="block cursor-pointer">
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
                        className="mr-2"
                      />
                      {optionLetter} {option}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          
          <button
            onClick={submitAnswers}
            className="w-full mt-4 bg-green-500 text-white p-2 rounded-lg"
          >
            Submit Answers
          </button>
        </div>
      )}

      {/* Display Level */}
      {level && (
        <div className="mt-6 p-4 bg-gray-100 text-center rounded-lg">
          <h2 className="text-xl font-semibold">Your Level: {level}</h2>
        </div>
      )}
    </div>
  );
}
