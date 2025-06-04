import React from 'react';

const SignupBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700"></div>
      
      {/* Wave patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg className="absolute top-0 left-0 w-full transform rotate-180" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" fillOpacity="0.5" d="M0,96L60,106.7C120,117,240,139,360,138.7C480,139,600,117,720,128C840,139,960,181,1080,186.7C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="absolute h-4 w-4 rounded-full bg-white opacity-20 animate-pulse" style={{ top: '15%', left: '10%', animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute h-6 w-6 rounded-full bg-white opacity-20 animate-pulse" style={{ top: '25%', left: '80%', animationDelay: '0.5s', animationDuration: '4s' }}></div>
        <div className="absolute h-3 w-3 rounded-full bg-white opacity-20 animate-pulse" style={{ top: '60%', left: '25%', animationDelay: '1s', animationDuration: '3.5s' }}></div>
        <div className="absolute h-5 w-5 rounded-full bg-white opacity-20 animate-pulse" style={{ top: '70%', left: '70%', animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
        <div className="absolute h-4 w-4 rounded-full bg-white opacity-20 animate-pulse" style={{ top: '35%', left: '50%', animationDelay: '2s', animationDuration: '5s' }}></div>
      </div>
    </div>
  );
};

export default SignupBackground;
