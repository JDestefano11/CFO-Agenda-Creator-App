import React from 'react';

const StepIndicator = ({ step }) => {
  return (
    <div className="relative mb-10 mt-2">
      {/* Progress bar background */}
      <div className="absolute top-1/3 w-full h-1 bg-gray-200 rounded-full"></div>
      
      {/* Progress bar fill */}
      <div 
        className="absolute top-1/3 h-1 bg-indigo-600 rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${((step - 1) / 2) * 100}%` }}
      ></div>
      
      <div className="relative flex">
        {/* Step 1 - Left */}
        <div className="flex flex-col items-center" style={{ flex: '1' }}>
          <div 
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step > 1 
                ? 'border-indigo-600 bg-indigo-600 text-white' 
                : step === 1 
                  ? 'border-indigo-600 bg-white text-indigo-600' 
                  : 'border-gray-300 bg-white text-gray-400'
            } transition-all duration-300 ease-in-out shadow-md`}
          >
            {step > 1 ? (
              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-sm font-medium">1</span>
            )}
          </div>
          <div className={`text-sm mt-2 font-medium ${step >= 1 ? 'text-indigo-600' : 'text-gray-500'}`}>
            Personal
          </div>
        </div>
        
        {/* Step 2 - Center */}
        <div className="flex flex-col items-center" style={{ flex: '1' }}>
          <div 
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step > 2 
                ? 'border-indigo-600 bg-indigo-600 text-white' 
                : step === 2 
                  ? 'border-indigo-600 bg-white text-indigo-600' 
                  : 'border-gray-300 bg-white text-gray-400'
            } transition-all duration-300 ease-in-out shadow-md`}
          >
            {step > 2 ? (
              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-sm font-medium">2</span>
            )}
          </div>
          <div className={`text-sm mt-2 font-medium ${step >= 2 ? 'text-indigo-600' : 'text-gray-500'}`}>
            Email
          </div>
        </div>
        
        {/* Step 3 - Right */}
        <div className="flex flex-col items-center" style={{ flex: '1' }}>
          <div 
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step > 3 
                ? 'border-indigo-600 bg-indigo-600 text-white' 
                : step === 3 
                  ? 'border-indigo-600 bg-white text-indigo-600' 
                  : 'border-gray-300 bg-white text-gray-400'
            } transition-all duration-300 ease-in-out shadow-md`}
          >
            {step > 3 ? (
              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-sm font-medium">3</span>
            )}
          </div>
          <div className={`text-sm mt-2 font-medium ${step >= 3 ? 'text-indigo-600' : 'text-gray-500'}`}>
            Company & Password
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
