import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-indigo-900 mb-6">
            CFO Agenda Creator
          </h1>
          <p className="text-xl text-gray-700 mb-10">
            AI-powered tool for gathering and analyzing financial documentation
            to streamline your meetings with CFOs of publicly listed companies
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg shadow-lg relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-700 to-purple-700 transition-all duration-500 ease-out group-hover:w-full"></span>
                  <span className="relative z-10">Get Started</span>
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-lg shadow-lg border border-indigo-200 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-50 to-purple-100 transition-all duration-500 ease-out group-hover:w-full"></span>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-purple-800">
                    Sign In
                  </span>
                </Link>
              </>
            ) : (
              <Link
                to="/upload"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg shadow-lg relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-700 to-purple-700 transition-all duration-500 ease-out group-hover:w-full"></span>
                <span className="relative z-10">Upload Document</span>
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                AI-Generated Agendas
              </h3>
              <p className="text-gray-600 text-center">
                Automatically generate comprehensive meeting agendas based on
                financial documentation analysis for publicly listed companies.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Financial Control
              </h3>
              <p className="text-gray-600 text-center">
                Support the setup and updating of financial control frameworks
                by analyzing annual reports and company documentation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Smart Communication
              </h3>
              <p className="text-gray-600 text-center">
                Generate draft emails and surveys with targeted questions to
                gather missing information from CFOs efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
