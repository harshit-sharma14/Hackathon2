import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { UserContext } from "../UserContext";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A833B9", "#E91E63"];

const Dashboard = () => {
  const [results, setResults] = useState([]);
   const {user}=useContext(UserContext);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("/api/user-results", { userId: user._id });

        setResults(response.data);
      } catch (error) {
        console.error("Error fetching user results", error);
      }
    };
    fetchResults();
  }, []);

  // Group results by skill
  const skillScores = results.reduce((acc, result) => {
    acc[result.skill] = (acc[result.skill] || 0) + result.score;
    return acc;
  }, {});

  // Convert to chart-friendly format
  const pieData = Object.keys(skillScores).map((skill, index) => ({
    name: skill,
    value: skillScores[skill],
    color: COLORS[index % COLORS.length],
  }));

  const barData = Object.keys(skillScores).map((skill) => ({
    skill,
    score: skillScores[skill],
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">User Performance Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-semibold text-center mb-4">Score Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Bar Chart */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-semibold text-center mb-4">Scores by Skill</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
