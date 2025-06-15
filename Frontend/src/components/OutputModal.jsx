import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaFileAlt,
  FaEnvelope,
  FaClipboardList,
  FaFileSignature,
  FaUserPlus,
} from "react-icons/fa";
import "../index.css";

const OutputModal = ({ isOpen, onClose, onGenerate, documentId }) => {
  // Animation state
  const [animateIn, setAnimateIn] = useState(false);

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    }
  }, [isOpen]);
  const [outputType, setOutputType] = useState("email");
  const [primaryStakeholder, setPrimaryStakeholder] = useState("CFO");
  const [customOutputType, setCustomOutputType] = useState("");
  const [customStakeholder, setCustomStakeholder] = useState("");
  const [isCustomStakeholder, setIsCustomStakeholder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setOutputType("email");
      setPrimaryStakeholder("CFO");
      setCustomOutputType("");
      setCustomStakeholder("");
      setIsCustomStakeholder(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare options object
    const options = {
      documentId,
      outputType,
      // Use custom stakeholder if selected, otherwise use the dropdown value
      primaryStakeholder: isCustomStakeholder
        ? customStakeholder
        : primaryStakeholder,
      // Only include customOutputType if outputType is 'other'
      ...(outputType === "other" && { customOutputType }),
    };

    // Call the onGenerate callback with the options
    onGenerate(options);

    // Reset form
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with gradient and waves */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 transition-opacity"></div>

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

        {/* Close overlay area */}
        <div className="absolute inset-0" onClick={onClose}></div>
      </div>

      {/* Modal */}
      <div className="relative bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-md mx-4 p-8 z-10 border border-indigo-100 transform transition-all duration-300 ease-in-out animate-fadeIn">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors duration-200 bg-white rounded-full p-1 shadow-sm hover:shadow-md"
          onClick={onClose}
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-indigo-900 mb-2">
            Generate Export Content
          </h3>
          <p className="text-gray-600 text-sm">
            Choose your preferred output format and stakeholder
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Output Type Selection */}
          <div className="mb-6">
            <label className="block text-indigo-800 text-sm font-bold mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Output Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Email Option */}
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer ${
                  outputType === "email"
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700 shadow-md transform scale-[1.02]"
                    : "border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                }`}
                onClick={() => setOutputType("email")}
              >
                <FaEnvelope className="mr-2" />
                <span>Email</span>
              </button>

              {/* Survey Option */}
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-md border ${
                  outputType === "survey"
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700 shadow-md transform scale-[1.02]"
                    : "border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                }`}
                onClick={() => setOutputType("survey")}
              >
                <FaClipboardList className="mr-2" />
                <span>Survey</span>
              </button>

              {/* Memo/Agenda Option */}
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-md border ${
                  outputType === "agenda"
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700 shadow-md transform scale-[1.02]"
                    : "border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                }`}
                onClick={() => setOutputType("agenda")}
              >
                <FaFileAlt className="mr-2" />
                <span>Memo</span>
              </button>

              {/* Other Option */}
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-md border ${
                  outputType === "other"
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700 shadow-md transform scale-[1.02]"
                    : "border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                }`}
                onClick={() => setOutputType("other")}
              >
                <FaFileSignature className="mr-2" />
                <span>Other</span>
              </button>
            </div>
          </div>

          {/* Custom Output Type (only shown if 'other' is selected) */}
          {outputType === "other" && (
            <div className="mb-6 animate-fadeIn">
              <label className="block text-indigo-800 text-sm font-bold mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Custom Output Type
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter custom output type..."
                value={customOutputType}
                onChange={(e) => setCustomOutputType(e.target.value)}
                required
              />
            </div>
          )}

          {/* Primary Stakeholder Selection */}
          <div className="mb-4">
            <label className="block text-indigo-800 text-sm font-bold mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Primary Stakeholder
            </label>

            {!isCustomStakeholder ? (
              <select
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
                value={primaryStakeholder}
                onChange={(e) => setPrimaryStakeholder(e.target.value)}
                required
              >
                <option value="CFO">CFO</option>
                <option value="VP of Finance">VP of Finance</option>
                <option value="Head of Accounting">Head of Accounting</option>
              </select>
            ) : (
              <div className="animate-fadeIn">
                <input
                  type="text"
                  className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter custom stakeholder..."
                  value={customStakeholder}
                  onChange={(e) => setCustomStakeholder(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* Toggle between dropdown and custom input */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setIsCustomStakeholder(!isCustomStakeholder)}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center cursor-pointer transition-colors"
            ></button>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md w-full max-w-xs cursor-pointer"
              disabled={
                isSubmitting ||
                (outputType === "other" && !customOutputType) ||
                (isCustomStakeholder && !customStakeholder)
              }
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
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
                  Generating...
                </div>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutputModal;
