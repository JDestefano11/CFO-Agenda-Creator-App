import React from 'react';
import '../index.css';

const LoadingPage = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background with gradient and waves */}
      <div className="fixed inset-0 overflow-hidden">
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
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-white opacity-60 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Animated circles */}
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 opacity-30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-300 opacity-50 animate-pulse"></div>
              
              {/* Document icon */}
              <div className="relative bg-indigo-600 text-white rounded-full p-4 shadow-lg">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">Generating Your Content</h2>
          <p className="text-gray-600 mb-6">{message || "We're preparing your export content. This will just take a moment..."}</p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
            <div className="bg-indigo-600 h-2.5 rounded-full animate-progressBar"></div>
          </div>
          
          {/* Animated steps */}
          <div className="flex flex-col space-y-3 text-left">
            <div className="flex items-center text-indigo-700 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Analyzing document structure</span>
            </div>
            <div className="flex items-center text-indigo-700 animate-fadeIn" style={{ animationDelay: '1.5s' }}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Processing approved topics</span>
            </div>
            <div className="flex items-center text-indigo-700 animate-fadeIn" style={{ animationDelay: '2.5s' }}>
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Generating export content</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
