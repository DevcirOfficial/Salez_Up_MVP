import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./salez_up_logo.jpg";

// CSS animations for the background blobs
const blobAnimation = `
@keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
    animation: blob 7s infinite;
}
.animation-delay-2000 {
    animation-delay: 2s;
}
.animation-delay-4000 {
    animation-delay: 4s;
}
`;

export default function SignUp() {
  // Add style tag for animations
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = blobAnimation;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Encryption key
  const ENCRYPTION_KEY = "DBBDRSSR54321";

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password != formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const responses = await fetch("https://crmapi.devcir.co/api/admin_portal_login");
      if (!responses.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await responses.json();

      const emailExists = userData.some((user) => user.admin_email == formData.email);
      if (emailExists) {
        toast.error("Email already exists. Please use a different email.");
        return;
      }

      // Encrypt password
      const encryptedPassword = CryptoJS.AES.encrypt(
        formData.password,
        "DBBDRSSR54321"
      ).toString();

      console.log("Reg", encryptedPassword);

      // Prepare data for API
      const apiData = {
        admin_username: formData.username,
        admin_email: formData.email,
        admin_password: encryptedPassword,
      };

      console.log("Sending data to API:", {
        admin_username: apiData.admin_username,
        admin_email: apiData.admin_email,
        password: "(encrypted)",
      });

      // Make API call using axios
      const response = await axios.post(
        "https://crmapi.devcir.co/api/admin_portal_login",
        apiData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Response received:", response.data);

      // Show success message
      toast.success("Account created successfully!");

      navigate("/admin_login");

      // Clear form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error during submission:", error);

      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An error occurred while submitting the form");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="relative min-h-screen overflow-hidden bg-gray-50">
        {/* Animated background blobs */}
        <div className="absolute top-20 left-2 w-[500px] h-[500px] bg-[#4cc7b2] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="hidden xl:block absolute bottom-10 left-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-10 right-52 w-[500px] h-[500px] bg-[#CAEEF580] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-4000"></div>

        {/* Main content */}
        <div className="flex flex-col justify-center min-h-screen py-6 sm:px-6 lg:px-8">
          {/* Logo and title */}
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="w-auto h-12 mx-auto"
              src={logo}
              alt="Your Company"
            />

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-[#279f8b]">
              Create your account
            </h2>
          </div>

          {/* Form container */}
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {/* Username field */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-[#279f8b]"
                  >
                    Admin Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-[#4cc7b2] focus:outline-none focus:ring-[#4cc7b2] sm:text-sm"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#279f8b]"
                  >
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-[#4cc7b2] focus:outline-none focus:ring-[#4cc7b2] sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#279f8b]"
                  >
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-[#4cc7b2] focus:outline-none focus:ring-[#4cc7b2] sm:text-sm"
                      placeholder="Enter your password"
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                    >
                      {showPassword ? (
                        <RxEyeOpen className="text-xl text-gray-500" />
                      ) : (
                        <RxEyeClosed className="text-xl text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#279f8b]"
                  >
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-[#4cc7b2] focus:outline-none focus:ring-[#4cc7b2] sm:text-sm"
                      placeholder="Confirm your password"
                    />
                    <div
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <RxEyeOpen className="text-xl text-gray-500" />
                      ) : (
                        <RxEyeClosed className="text-xl text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition-all duration-300 border border-transparent rounded-md shadow-sm bg-[#279f8b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4cc7b2] focus:ring-offset-2 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
                        Creating account...
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </div>
              </form>

              <br />
              <div className="flex flex-row justify-between ">
                <p className="text-[#4f5756] mt-2">
                  Already a Member Login Now !{" "}
                </p>
                <button
                  onClick={() => {
                    navigate("/admin_Login");
                  }}
                  className="px-4 py-2 bg-[#279f8b] text-white hover:scale-125 hover:transition-all hover:duration-300
                            hover:cursor-pointer rounded-lg font-semibold"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
