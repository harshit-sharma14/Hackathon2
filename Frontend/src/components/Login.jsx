import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [redirect, setRedirect] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/login", formData);
      const { token, user } = response.data;
        console.log('UUUSERRR',response.data);
      // Set user in context
      setUser(user);

      // Store token and user in local storage
      localStorage.setItem("token", token);
      console.log('iusdn',user);
      localStorage.setItem("user", JSON.stringify(response.data));

      // Redirect to home page
      setRedirect(true);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.msg || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
  
        <form 
          onSubmit={handleSubmit} 
          className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
        >
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
      
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
      
          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      );
      
  
};

export default Login;