import React from 'react';

const SignupSidebar = () => {
  return (
    <div className="hidden md:block w-2/5 bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg className="absolute right-0 top-0 h-40 w-40 text-white transform translate-x-1/4 -translate-y-1/4" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" />
        </svg>
        <svg className="absolute left-0 bottom-0 h-80 w-80 text-white transform -translate-x-1/2 translate-y-1/4" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" />
        </svg>
      </div>
      
      {/* Logo and company name */}
      <div className="flex items-center mb-12 relative z-10">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold">CFO Agenda</h2>
      </div>
      
      <h3 className="text-2xl font-bold mb-6 relative z-10">Welcome to the future of board meetings</h3>
      <p className="text-indigo-100 mb-10 text-lg relative z-10">
        Create, manage, and optimize your board meeting agendas with ease. Join thousands of CFOs who trust our platform.
      </p>
      
      <div className="space-y-6 relative z-10">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-md">
            <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-base text-white font-medium">Streamlined agenda creation</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-md">
            <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-base text-white font-medium">Secure document management</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-md">
            <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-base text-white font-medium">Collaborative tools for your team</p>
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
  );
};

export default SignupSidebar;
