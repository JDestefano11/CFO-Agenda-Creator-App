import React from "react";
import PasswordStrengthMeter from "../../common/PasswordStrengthMeter";

const CompanyPasswordStep = ({
  formData,
  handleChange,
  handlePasswordChange,
  passwordStrength,
  passwordRequirements,
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="companyName"
          className="block text-xs font-medium text-gray-700"
        >
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          className="mt-0.5 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="companyType"
            className="block text-xs font-medium text-gray-700"
          >
            Company Type
          </label>
          <select
            id="companyType"
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            required
            className="mt-0.5 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select type</option>
            <option value="Public">Publicly Listed</option>
            <option value="Private">Private</option>
            <option value="Pre-IPO">Pre-IPO</option>
            <option value="Consulting">Consulting Firm</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="jobTitle"
            className="block text-xs font-medium text-gray-700"
          >
            Job Title
          </label>
          <select
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
            className="mt-0.5 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select your role</option>
            <option value="CFO">CFO</option>
            <option value="VP of Finance">VP of Finance</option>
            <option value="Controller">Controller</option>
            <option value="Finance Director">Finance Director</option>
            <option value="Compliance Officer">Compliance Officer</option>
            <option value="Internal Audit">Internal Audit</option>
            <option value="External Consultant">External Consultant</option>
            <option value="Financial Analyst">Financial Analyst</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handlePasswordChange}
          required
          className="mt-0.5 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="h-8">
          {" "}
          {/* Fixed height container */}
          {formData.password ? (
            <PasswordStrengthMeter
              strength={passwordStrength}
              requirements={passwordRequirements}
            />
          ) : null}
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="mt-0.5 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="agreeToTerms" className="text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CompanyPasswordStep;
