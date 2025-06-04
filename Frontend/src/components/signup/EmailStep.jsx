import React from 'react';

const EmailStep = ({ formData, handleChange }) => {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <div className="relative rounded-md shadow-sm">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john.doe@example.com"
            className="block w-full px-3 py-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">We'll never share your email with anyone else.</p>
      </div>
      
      <div>
        <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-1">Confirm Email Address</label>
        <div className="relative rounded-md shadow-sm">
          <input
            type="email"
            id="confirmEmail"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            required
            placeholder="Confirm your email address"
            className="block w-full px-3 py-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailStep;
