import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { saveToken, saveUser } from "../utils/localStorage";
import { calculatePasswordStrength } from "../utils/PasswordStrength";

// Import components
import StepIndicator from "../components/signup/StepIndicator";
import PersonalInfoStep from "../components/signup/PersonalInfoStep";
import EmailStep from "../components/signup/EmailStep";
import CompanyPasswordStep from "../components/signup/CompanyPasswordStep";
import SignupBackground from "../components/signup/SignupBackground";
import SignupSidebar from "../components/signup/SignupSidebar";
import FormNavigation from "../components/signup/FormNavigation";

// Configure axios with base URL
axios.defaults.baseURL = "https://cfo-agenda-creator-21d886a774e1.herokuapp.com/";
axios.defaults.withCredentials = true;

const Signup = () => {
  const navigate = useNavigate();

  // Step state for multi-step form
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    confirmEmail: "",
    companyName: "",
    companyType: "",
    jobTitle: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (error) setError("");
  };

  // Handle password changes with strength calculation
  const handlePasswordChange = (e) => {
    const password = e.target.value;

    // Update form data
    setFormData({
      ...formData,
      password: password,
    });

    // Calculate password strength using utility function
    const result = calculatePasswordStrength(password);
    setPasswordStrength(result.strength);
    setPasswordRequirements(result.requirements);

    // Clear errors when user types
    if (error) setError("");
  };

  // Validate current step
  const validateStep = () => {
    let errorMessage = "";

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) {
          errorMessage = "First name is required";
        } else if (!formData.lastName.trim()) {
          errorMessage = "Last name is required";
        } else if (!formData.username.trim()) {
          errorMessage = "Username is required";
        }
        break;

      case 2: // Email Information
        if (!formData.email.trim()) {
          errorMessage = "Email is required";
        } else if (!formData.confirmEmail.trim()) {
          errorMessage = "Please confirm your email";
        } else if (formData.email !== formData.confirmEmail) {
          errorMessage = "Email addresses do not match";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          errorMessage = "Please enter a valid email address";
        }
        break;

      case 3: // Password and Company Information
        if (!formData.companyName.trim()) {
          errorMessage = "Company name is required";
        } else if (!formData.companyType.trim()) {
          errorMessage = "Company type is required";
        } else if (!formData.jobTitle.trim()) {
          errorMessage = "Job title is required";
        } else if (!formData.password) {
          errorMessage = "Password is required";
        } else if (!formData.confirmPassword) {
          errorMessage = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
          errorMessage = "Passwords do not match";
        } else if (passwordStrength < 2) {
          errorMessage = "Password is too weak";
        } else if (!formData.agreeToTerms) {
          errorMessage = "You must agree to the terms and conditions";
        }
        break;

      default:
        break;
    }

    if (errorMessage) {
      setError(errorMessage);
      return false;
    }

    return true;
  };

  // Handle next step navigation
  const handleNextStep = () => {
    if (validateStep()) {
      setError("");
      setStep(step + 1);
    }
  };

  // Handle previous step navigation
  const handlePrevStep = () => {
    setError("");
    setStep(Math.max(1, step - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (validateStep()) {
      setLoading(true);

      // Prepare data for submission
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        confirmEmail: formData.confirmEmail,
        companyName: formData.companyName,
        companyType: formData.companyType,
        jobTitle: formData.jobTitle,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      try {
        // Connect to backend API
        const response = await axios.post("api/users/signup", userData);

        console.log("Registration successful:", response.data);
        setLoading(false);
        setSuccess(true);

        // Store token and user data if provided by the backend
        saveToken(response.data.token);
        saveUser(response.data.user);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setLoading(false);

        // Handle specific error messages from the backend
        if (error.response) {
          if (error.response.status === 404) {
            setError(
              "The signup endpoint was not found. Please make sure your backend has the /api/users/signup route configured."
            );
          } else if (error.response.data && error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError("Registration failed. Please try again.");
          }
        } else if (
          error.code === "ERR_NETWORK" ||
          error.message === "Network Error"
        ) {
          setError(
            "Cannot connect to the server. Please make sure the backend server is running at https://cfo-agenda-creator-21d886a774e1.herokuapp.com/"
          );
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background with waves and gradient */}
      <SignupBackground />

      {/* Main container - Smaller size */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex min-h-[650px] border border-indigo-100">
        {/* Left side - Brand/Info */}
        <SignupSidebar />

        {/* Right side - Form */}
        <div className="w-full md:w-3/5 p-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-indigo-900">
              Create your account
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Join our platform and start creating professional board meeting
              agendas.
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                Registration Successful!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Your account has been created successfully. You can now sign in.
              </p>
            </div>
          ) : (
            <form
              onSubmit={step === 3 ? handleSubmit : handleNextStep}
              className="space-y-3"
            >
              {/* Step indicator */}
              <StepIndicator step={step} />

              {/* Step 1: Personal Information */}
              {step === 1 && (
                <PersonalInfoStep
                  formData={formData}
                  handleChange={handleChange}
                />
              )}

              {/* Step 2: Email Information */}
              {step === 2 && (
                <EmailStep formData={formData} handleChange={handleChange} />
              )}

              {/* Step 3: Company and Password Information */}
              {step === 3 && (
                <CompanyPasswordStep
                  formData={formData}
                  handleChange={handleChange}
                  handlePasswordChange={handlePasswordChange}
                  passwordStrength={passwordStrength}
                  passwordRequirements={passwordRequirements}
                />
              )}

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-2 mt-2 text-xs">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-4 w-4 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <FormNavigation
                step={step}
                loading={loading}
                handlePrevStep={handlePrevStep}
                handleNextStep={handleNextStep}
                isLastStep={step === 3}
              />
            </form>
          )}

          <div className="mt-8 py-4 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-500">
                Already have an account?
              </span>
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                Sign in
                <svg
                  className="ml-1 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
