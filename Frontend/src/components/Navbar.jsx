import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "../config/api";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get user data from localStorage and fetch updated profile from backend
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userData) {
      setUser(JSON.parse(userData));

      if (token) {
        fetchUserProfile(token);
      }
    }
  }, []);

  // Fetch user profile from backend
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user in state and localStorage
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);

      // If token is invalid, clear it and redirect to login
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/auth?mode=login");
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/auth?mode=login");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "G";
    return `${user.firstName?.charAt(0) || ""}${
      user.lastName?.charAt(0) || ""
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white p-4 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">CFO Agenda Creator</div>
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/auth?mode=login"
                className="px-5 py-2 border border-white/70 text-white font-medium rounded-lg bg-gradient-to-r from-transparent to-transparent hover:from-indigo-700 hover:to-purple-700 hover:border-indigo-400 transition-all duration-500 shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/auth?mode=signup"
                className="px-5 py-2 bg-white text-indigo-700 font-medium rounded-lg relative overflow-hidden shadow-md group"
              >
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-50 to-purple-100 transition-all duration-500 ease-out group-hover:w-full"></span>
                <span className="relative z-10 transition-colors duration-300 group-hover:text-purple-800">
                  Sign Up
                </span>
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none group"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full object-cover transition-all duration-200 group-hover:ring-2 group-hover:ring-white/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium transition-all duration-200 group-hover:bg-indigo-500 group-hover:ring-2 group-hover:ring-white/50">
                    {getUserInitials()}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-gray-500 truncate">{user.email}</div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
