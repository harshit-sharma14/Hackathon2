//Harshit14
const { GoogleGenerativeAI } = require("@google/generative-ai");

const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose=require('mongoose')
const Users=require('./models/Users')
const multer = require("multer");
const fs = require("fs");   
const FormData = require("form-data");
const axios = require("axios");
const OpenAI = require("openai");
const Question = require("./models/QuestionSchema");
const UserResult = require("./models/UserResultSchema");

dotenv.config();
const app = express();
//Hacathon01
// Middleware
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'
}))
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🚀 MongoDB Connected Successfully!"))
  .catch((err) => console.log("Database Connection Error:", err));
  const PORT = process.env.PORT || 5000;


  //register
  app.post('/register', async (req, res) => {
    try {
      const { name, email, password, linkedinProfile, role, skills, careerGoals } = req.body;
  
      // Check if user already exists
      let user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists' });
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user with all fields
      user = new Users({
        name,
        email,
        password: hashedPassword,
        linkedinProfile,
        role: role || 'user', // Default to 'user' if role is not provided
        skills: skills || [], // Default to empty array if skills are not provided
        careerGoals: careerGoals || [], // Default to empty array if careerGoals are not provided
      });
  
      // Save the user to the database
      await user.save();
  
      // Respond with success message
      res.status(201).json({ msg: 'User registered successfully', user });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

    //login

  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      // Generate JWT token
      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token,user });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  //auth middleware
  const auth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
    console.log(token)
    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token; // Extract token

    try {
      const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('hi')
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ msg: "Invalid token" });
    }
  };
//   const config=new Configuration({
//     apiKey:process.env.OPENAI_API_KEY   
//     });
    // const openAi=new OpenAIApi(config);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Define Mongoose Schema & Model
   
    
    // Generate Questions using Gemini API
    const generateSkillQuestions = async (req, res) => {
        const { skill } = req.body;
        if (!skill) return res.status(400).json({ error: "Skill is required" });
      
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
          const prompt = `Generate 12 multiple-choice questions (MCQs) for ${skill}. Format:
          
            Question: <question text>
            Options:
            A) <option 1>
            B) <option 2>
            C) <option 3>
            D) <option 4>
            Correct Answer: <Correct Option Letter>`;
      
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          
          // Parse MCQs from the response
          const mcqQuestions = responseText.split("\n\n").map(block => {
            const lines = block.split("\n");
            // console.log('lines',lines)
            const question = lines[0].replace("Question: ", "").trim();
            const options = [
              lines[1].replace("A) ", "").trim(),
              lines[2].replace("B) ", "").trim(),
              lines[3].replace("C) ", "").trim(),
              lines[4].replace("D) ", "").trim(),
            ];
            const correctAnswer = lines[5].replace("Correct Answer: ", "").trim();
      
            return { skill, question, options, correctAnswer };
          });
      
          await Question.insertMany(mcqQuestions);
      
          res.status(200).json({ success: true, questions: mcqQuestions });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };
    
    // Evaluate Answers and Assign a Level
    // const evaluateAnswers = async (req, res) => {
    //     const { userId, skill, answers } = req.body;
    //     if (!userId || !skill || !answers) return res.status(400).json({ error: "Missing data" });
      
    //     try {
    //       const questions = await Question.find({ skill });
    //       let correctCount = 0;
      
    //       questions.forEach((q, index) => {
    //         // Ensure q.answer is a string and not null/undefined
    //         if (typeof q.answer === 'string' && answers[index]?.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
    //           correctCount++;
    //         }
    //       });
      
    //       let level;
    //       if (correctCount <= 3) level = "Beginner";
    //       else if (correctCount <= 6) level = "Intermediate";
    //       else if (correctCount <= 8) level = "Advanced";
    //       else level = "Expert";
      
    //       res.status(200).json({ success: true, level, correctCount });
    //     } catch (error) {
    //       res.status(500).json({ error: error.message });
    //     }
    //   };
    const evaluateAnswers = async (req, res) => {
      const { userId, skill, answers } = req.body;
      console.log(req.body)
      if (!userId || !skill || !answers) {
          return res.status(400).json({ error: "Missing data" });
      }
  
      try {
          const questions = await Question.find({ skill });
          let correctCount = 0;
  
          questions.forEach((q, index) => {
              // Ensure q.answer is an array and compare it correctly
              if (Array.isArray(q.answer) && answers[index]) {
                  const correctAnswer = q.answer[0]?.trim().toLowerCase(); // Extract correct answer from array
                  if (answers[index].trim().toLowerCase() === correctAnswer) {
                      correctCount++;
                  }
              }
          });
  
          // Determine user level based on correct answers
          let level;
          if (correctCount <= 3) level = "Beginner";
          else if (correctCount <= 6) level = "Intermediate";
          else if (correctCount <= 8) level = "Advanced";
          else level = "Expert";
  
          // Save the result in the database
          const userResult = new UserResult({
              userId,
              skill,
              score: correctCount,
              level,
          });
  
          await userResult.save();
  
          res.status(200).json({ success: true, level, correctCount, result: userResult });
      } catch (error) {
          console.error("Error evaluating answers:", error);
          res.status(500).json({ error: error.message });
      }
  };
  
    app.post("/generate-questions", generateSkillQuestions);
    app.post("/evaluate", evaluateAnswers);
    // const generateSkillQuestions = async (req, res) => {
    //     const { skill } = req.body;
    //     if (!skill) return res.status(400).json({ error: "Skill is required" });
      
    //     try {
    //       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    //       const prompt = `Generate 12 multiple-choice questions (MCQs) for ${skill}. Format:
          
    //         Question: <question text>
    //         Options:
    //         A) <option 1>
    //         B) <option 2>
    //         C) <option 3>
    //         D) <option 4>
    //         Correct Answer: <Correct Option Letter>`;
      
    //       const result = await model.generateContent(prompt);
    //       const responseText = result.response.text();
      
    //       // Parse MCQs from the response
    //       const mcqQuestions = responseText.split("\n\n").map(block => {
    //         const lines = block.split("\n");
    //         const question = lines[0].replace("Question: ", "").trim();
    //         const options = [
    //           lines[1].replace("A) ", "").trim(),
    //           lines[2].replace("B) ", "").trim(),
    //           lines[3].replace("C) ", "").trim(),
    //           lines[4].replace("D) ", "").trim(),
    //         ];
    //         const correctAnswer = lines[5].replace("Correct Answer: ", "").trim();
      
    //         return { skill, question, options, correctAnswer };
    //       });
      
    //       await Question.insertMany(mcqQuestions);
      
    //       res.status(200).json({ success: true, questions: mcqQuestions });
    //     } catch (error) {
    //       res.status(500).json({ error: error.message });
    //     }
    //   };
    // const generateSkillQuestions = async (req, res) => {
    //     const { skill } = req.body;
    //     if (!skill) return res.status(400).json({ error: "Skill is required" });
    
    //     try {
    //         const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    //         const prompt = `Generate 12 multiple-choice questions (MCQs) for ${skill}. Format:
    
    //         Question: <question text>
    //         Options:
    //         A) <option 1>
    //         B) <option 2>
    //         C) <option 3>
    //         D) <option 4>
    //         Correct Answer: <Correct Option Letter>`;
    
    //         const result = await model.generateContent(prompt);
    //         const responseText = result.response.text();
    
    //         // Split the response into question blocks based on double newlines
    //         const questionBlocks = responseText.split("\n\n").filter(block => block.includes("Question:"));
    
    //         const mcqQuestions = questionBlocks.map(block => {
    //             const lines = block.split("\n").map(line => line.trim());
    
    //             // Extract question text
    //             const questionLine = lines.find(line => line.startsWith("Question:"));
    //             if (!questionLine) {
    //                 throw new Error("Failed to extract question text");
    //             }
    //             const question = questionLine.replace("Question:", "").trim();
    
    //             // Extract options
    //             const options = lines
    //                 .filter(line => /^[A-D]\)/.test(line))
    //                 .map(line => line.replace(/^[A-D]\)\s/, "").trim());
    
    //             if (options.length !== 4) {
    //                 throw new Error(`Invalid number of options for question: ${question}`);
    //             }
    
    //             // Extract correct answer
    //             const correctAnswerLine = lines.find(line => line.startsWith("Correct Answer:"));
    //             if (!correctAnswerLine) {
    //                 throw new Error(`Correct answer missing for question: ${question}`);
    //             }
    //             const correctAnswerLetter = correctAnswerLine.replace("Correct Answer:", "").trim();
    //             const correctAnswerIndex = "ABCD".indexOf(correctAnswerLetter);
    
    //             // Validate correct answer index
    //             if (correctAnswerIndex === -1 || correctAnswerIndex >= options.length) {
    //                 throw new Error(`Invalid correct answer format: ${correctAnswerLetter} for question: ${question}`);
    //             }
    
    //             return { 
    //                 skill, 
    //                 question, 
    //                 answer: [options[correctAnswerIndex]] // Store the correct answer in an array
    //             };
    //         });
    
    //         await Question.insertMany(mcqQuestions);
    
    //         res.status(200).json({ success: true, questions: mcqQuestions });
    //     } catch (error) {
    //         console.error("Error generating questions:", error);
    //         res.status(500).json({ error: error.message });
    //     }
    // };
    
    
      app.get("/api/user", auth, async (req, res) => {
        try {
          const user = await Users.findById(req.userId).select("-password"); // Exclude password from the response
          if (!user) {
            return res.status(404).json({ error: "User not found." });
          }
      
          res.status(200).json({ user });
        } catch (error) {
          res.status(500).json({ error: "Server error." });
        }
      });
      // Evaluate MCQ Answers
    //   const evaluateAnswers = async (req, res) => {
    //     const { userId, skill, answers } = req.body;
    //     console.log(req.body);
    //     if (!userId || !skill || !Array.isArray(answers)) {
    //       return res.status(400).json({ error: "Invalid or missing data" });
    //     }
      
    //     try {
    //       const questions = await Question.find({ skill });
      
    //       if (questions.length === 0) {
    //         return res.status(404).json({ error: "No questions found for this skill" });
    //       }
      
    //       let correctCount = 0;
      
    //       questions.forEach((q, index) => {
    //         if (answers[index] && answers[index].trim().toUpperCase() === q.correctAnswer.trim().toUpperCase()) {
    //           correctCount++;
    //         }
    //       });
      
    //       let level;
    //       if (correctCount <= 3) level = "Beginner";
    //       else if (correctCount <= 6) level = "Intermediate";
    //       else if (correctCount <= 8) level = "Advanced";
    //       else level = "Expert";
      
    //       res.status(200).json({ success: true, level, correctCount });
    //     } catch (error) {
    //       console.error("Evaluation Error:", error);
    //       res.status(500).json({ error: "Internal Server Error" });
    //     }
    //   };
      
      
    //   app.post("/generate-questions", generateSkillQuestions);
    //   app.post("/evaluate", evaluateAnswers);
    
  //GET INFO
  app.get('/me', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });

  app.get("/getuser", auth, async (req, res) => {
    try {
        console.log(req.user);
      res.json(req.user); // Return user data stored in req.user from the auth middleware
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  });
  
  const upload = multer({ dest: "uploads/" });
  //parse resume

app.post("/upload", upload.single("resume"), async (req, res) => {
    const apiKey = process.env.API_LAYER_KEY;
    if (!apiKey) {
        console.error("API key is missing");
        return res.status(500).json({ error: "Server configuration error" });
    }
    console.log('API Key:', apiKey);

    // Check if a file is uploaded or a URL is provided
    if (req.file) {
        // Handle file upload
        const filePath = req.file.path;
        console.log('File path:', filePath);

        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));

        try {
            console.log('Sending request to resume parser API (file upload)...');
            const response = await axios.post("https://api.apilayer.com/resume-parser", formData, {
                headers: {
                    "apikey": apiKey,
                    ...formData.getHeaders()
                }
            });
            console.log('API response received:', response.data);

            fs.unlinkSync(filePath); // Delete file after parsing
            console.log('File deleted:', filePath);

            res.json({ parsedData: response.data });
        } catch (error) {
            console.error('Error during API request:', error.message);
            if (error.response) {
                console.error('API Response Error:', error.response.data);
            }
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Clean up on error
                console.log('File deleted after error:', filePath);
            }
            res.status(500).json({ error: error.response?.data || error.message });
        }
    } else if (req.body.url) {
        // Handle URL parsing
        const resumeUrl = req.body.url;
        console.log('Resume URL:', resumeUrl);

        const apiUrl = `https://api.apilayer.com/resume_parser/url?url=${encodeURIComponent(resumeUrl)}`;

        try {
            console.log('Sending request to resume parser API (URL parsing)...');
            const response = await axios.get(apiUrl, {
                headers: {
                    'apikey': apiKey
                }
            });
            console.log('API response received:', response.data);

            res.json({ parsedData: response.data });
        } catch (error) {
            console.error('Error during API request:', error.message);
            if (error.response) {
                console.error('API Response Error:', error.response.data);
            }
            res.status(500).json({ error: error.response?.data || error.message });
        }
    } else {
        // No file or URL provided
        console.error("No file or URL provided");
        res.status(400).json({ error: "No file or URL provided" });
    }
});

app.post("/api/user-results", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const results = await UserResult.find({ userId });

    if (!results.length) {
      return res.status(404).json({ message: "No results found for this user" });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user results" });
  }
});
app.get("/api/user-results", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const results = await UserResult.find({ userId });

    if (!results.length) {
      return res.status(404).json({ message: "No results found for this user" });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user results" });
  }
});


  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));