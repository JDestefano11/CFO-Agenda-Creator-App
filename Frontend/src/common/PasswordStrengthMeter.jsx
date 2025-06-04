import React from "react";
import {
  getStrengthClass,
  getStrengthText,
  getStrengthBarClass,
} from "../utils/passwordStrength";

const PasswordStrengthMeter = ({ strength, requirements }) => {
  // Get missing requirements
  const missingRequirements = [];
  if (!requirements.length) missingRequirements.push("8+ chars");
  if (!requirements.uppercase) missingRequirements.push("uppercase");
  if (!requirements.lowercase) missingRequirements.push("lowercase");
  if (!requirements.number) missingRequirements.push("number");
  if (!requirements.special) missingRequirements.push("special char");

  return (
    <div className="mt-1 text-xs" style={{ height: "32px" }}>
      <div className="flex items-center">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          {/* Strength bar */}
          <div
            className={`h-full ${getStrengthBarClass(
              strength
            )} transition-all duration-300`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>
        <span
          className={`ml-2 text-xs font-medium ${getStrengthClass(strength)}`}
        >
          {getStrengthText(strength)}
        </span>
      </div>

      {/* Always show a container for requirements with fixed height */}
      <div className="h-4 mt-0.5 text-xs text-gray-500 truncate">
        {missingRequirements.length > 0 && (
          <>
            <span className="text-red-500 mr-1">Missing:</span>
            {missingRequirements.join(", ")}
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
