import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Navbar from './Navbar';

const Dashboard = () => {
  // Static data for charts
  const assessmentData = [
    { name: 'React Basics', score: 85, date: '2023-10-01', status: 'Passed' },
    { name: 'Advanced JS', score: 72, date: '2023-09-25', status: 'In Progress' },
    { name: 'Tailwind CSS', score: 90, date: '2023-09-20', status: 'Passed' },
    { name: 'Node.js', score: 68, date: '2023-09-15', status: 'Failed' },
    { name: 'MongoDB', score: 88, date: '2023-09-10', status: 'Passed' },
  ];

  const performanceData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 70 },
    { month: 'Mar', score: 80 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 90 },
    { month: 'Jun', score: 85 },
  ];

  const passRateData = [
    { name: 'Passed', value: 75 },
    { name: 'Failed', value: 25 },
  ];

  const COLORS = ['#10B981', '#EF4444']; // Green for Passed, Red for Failed

  return (
    <div><Navbar/>
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Assessment Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Assessments */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">Total Assessments</h2>
          <p className="text-3xl font-bold text-blue-600">45</p>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">Average Score</h2>
          <p className="text-3xl font-bold text-green-600">78%</p>
        </div>

        {/* Card 3: Pass Rate */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">Pass Rate</h2>
          <p className="text-3xl font-bold text-purple-600">85%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Performance Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pass Rate Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Pass Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passRateData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {passRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Assessments Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Assessments</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assessment
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assessmentData.map((assessment, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {assessment.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {assessment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {assessment.score}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      assessment.status === 'Passed'
                        ? 'bg-green-100 text-green-800'
                        : assessment.status === 'Failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {assessment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;