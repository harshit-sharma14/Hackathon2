import React from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useContext } from 'react';
const Navbar = () => {
  const {user}=useContext(UserContext) // Static username for demonstration

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side: Logo and Links */}
          <div className="flex items-center">
            <Link to="/home" className="text-2xl font-bold text-blue-600">
              Learning Platform
            </Link>
            <div className="hidden md:flex space-x-8 ml-10">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
              >
                Dashboard
              </Link>
              <Link
                to="/eval"
                className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
              >
                Assessment
              </Link>
            </div>
          </div>

          {/* Right Side: User Info */}
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
                {user&& <span className="text-gray-700 font-medium">Harshit</span>}
             
              <img
                className="h-10 w-10 rounded-full"
                src="https://via.placeholder.com/150" // Placeholder image
                alt="User Avatar"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;