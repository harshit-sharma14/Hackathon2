import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    linkedinProfile: "",
    role: "user",
    skills: [],
    careerGoals: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle skills and careerGoals as arrays
    if (name === "skills" || name === "careerGoals") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((item) => item.trim()), // Convert comma-separated string to array
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/register", formData);
      setUser(data);
      alert("User registered successfully");
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.msg || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4"
    >
      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
  
      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
  
      {/* Password */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
  
      {/* LinkedIn Profile */}
      <input
        type="url"
        name="linkedinProfile"
        placeholder="LinkedIn Profile URL"
        value={formData.linkedinProfile}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
  
      {/* Skills */}
      <input
        type="text"
        name="skills"
        placeholder="Skills (e.g., JavaScript, React, Node.js)"
        value={formData.skills.join(", ")}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
  
      {/* Career Goals */}
      <input
        type="text"
        name="careerGoals"
        placeholder="Career Goals (e.g., Frontend Developer, Data Scientist)"
        value={formData.careerGoals.join(", ")}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
  
      {/* Role */}
      <select 
        name="role" 
        value={formData.role} 
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
  
      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading}
        className={`w-full p-3 rounded-lg text-white font-semibold ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Registering..." : "Register"}
      </button>
  
      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
  
};

export default Register;