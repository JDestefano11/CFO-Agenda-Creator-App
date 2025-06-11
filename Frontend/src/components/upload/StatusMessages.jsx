import React from 'react';

/**
 * StatusMessages component to display success and error messages
 */
const StatusMessages = ({ success, error }) => {
  if (!success && !error) return null;
  
  return (
    <>
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-500 text-green-700 rounded-md mx-auto max-w-md text-center">
          Documents uploaded successfully! Redirecting to analysis...
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-500 text-red-700 rounded-md mx-auto max-w-md text-center">
          {error}
        </div>
      )}
    </>
  );
};

export default StatusMessages;
