import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { saveToken, saveUser } from "../utils/localStorage";

// Backend URL
axios.defaults.baseURL = "https://cfo-agenda-creator-21d886a774e1.herokuapp.com/";
// Enable credentials for cookies if needed
axios.defaults.withCredentials = true;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Connect to backend API
      const response = await axios.post("/api/users/login", formData);

      // Store token and user data if provided by the backend
      saveToken(response.data.token);
      saveUser(response.data.user);

      // Show success message
      setSuccess("Login successful!");

      // Reset loading state
      setLoading(false);

      console.log("Login successful:", response.data);

      // Redirect to upload page after 1 second
      setTimeout(() => {
        window.location.href = "/upload";
      }, 1000);
    } catch (error) {
      setLoading(false);

      // Handle specific error messages from the backend
      if (error.response && error.response.data) {
        setError(
          error.response.data.message ||
            "Login failed. Please check your credentials."
        );
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error"
      ) {
        setError(
          "Cannot connect to the server. Please make sure the backend server is running at http://localhost:5000"
        );
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background with waves and gradient */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700"></div>

        {/* Wave patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          <svg
            className="absolute top-0 left-0 w-full transform rotate-180"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              fillOpacity="0.5"
              d="M0,96L60,106.7C120,117,240,139,360,138.7C480,139,600,117,720,128C840,139,960,181,1080,186.7C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          <div
            className="absolute h-4 w-4 rounded-full bg-white opacity-20 animate-pulse"
            style={{
              top: "15%",
              left: "10%",
              animationDelay: "0s",
              animationDuration: "3s",
            }}
          ></div>
          <div
            className="absolute h-6 w-6 rounded-full bg-white opacity-20 animate-pulse"
            style={{
              top: "25%",
              left: "80%",
              animationDelay: "0.5s",
              animationDuration: "4s",
            }}
          ></div>
          <div
            className="absolute h-3 w-3 rounded-full bg-white opacity-20 animate-pulse"
            style={{
              top: "60%",
              left: "25%",
              animationDelay: "1s",
              animationDuration: "3.5s",
            }}
          ></div>
          <div
            className="absolute h-5 w-5 rounded-full bg-white opacity-20 animate-pulse"
            style={{
              top: "70%",
              left: "70%",
              animationDelay: "1.5s",
              animationDuration: "4.5s",
            }}
          ></div>
          <div
            className="absolute h-4 w-4 rounded-full bg-white opacity-20 animate-pulse"
            style={{
              top: "35%",
              left: "50%",
              animationDelay: "2s",
              animationDuration: "5s",
            }}
          ></div>
        </div>
      </div>

      {/* Main container - Smaller size */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex min-h-[650px] border border-indigo-100">
        {/* Left side - Brand/Info */}
        <div className="hidden md:block w-2/5 bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg
              className="absolute right-0 top-0 h-40 w-40 text-white transform translate-x-1/4 -translate-y-1/4"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="50" />
            </svg>
            <svg
              className="absolute left-0 bottom-0 h-80 w-80 text-white transform -translate-x-1/2 translate-y-1/4"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="50" />
            </svg>
          </div>

          {/* Logo and company name */}
          <div className="flex items-center mb-12 relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg
                className="h-8 w-8 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">CFO Agenda</h2>
          </div>

          <h3 className="text-2xl font-bold mb-6 relative z-10">
            Board Meeting Excellence
          </h3>
          <p className="text-indigo-100 mb-10 text-lg relative z-10">
            Generate ready-to-share CFO agendas in under 60 seconds with our
            AI-powered platform.
          </p>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-md">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-base text-white font-medium">
                  Encrypted & audit-ready
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-md">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-base text-white font-medium">
                  AI-powered agenda templates
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-md">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-base text-white font-medium">
                  Real-time collaboration
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-indigo-500 relative z-10">
            <div className="text-center">
              <p className="text-indigo-300/60 text-xs">
                &copy; {new Date().getFullYear()} CFO Agenda Creator
              </p>
              <p className="text-indigo-300/60 text-xs mt-1">
                All rights reserved
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-3/5 p-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-indigo-900">Welcome back</h2>
            <p className="text-base text-gray-600 mt-2">
              Sign in to access your account and create agendas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="pl-10 block w-full px-3 py-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="mt-1 flex justify-end">
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                  onClick={() =>
                    alert("Forgot email functionality will be implemented here")
                  }
                >
                  Forgot email?
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="pl-10 block w-full px-3 py-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="mt-1 flex justify-end">
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                  onClick={() =>
                    alert(
                      "Forgot password functionality will be implemented here"
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm flex items-start">
                <svg
                  className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-600 text-sm flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 min-w-[140px] justify-center transition-colors"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <svg
                      className="ml-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 py-4 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-500">
                  New to CFO Agenda?
                </span>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  Create an account
                  <svg
                    className="ml-1 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
