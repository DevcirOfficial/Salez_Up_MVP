import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import { BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo_png from "./image.jpg";

const Head_of_sales_SignUp = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [commission, setCommission] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);

  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imagePath = URL.createObjectURL(file);
      setImage(file);
      setImagePath(imagePath);
      console.log("My Image Path:", imagePath);
    }
  };

  const registerSuccesful = () =>
    toast.success("Successfully registered", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const fillAllCredentials = () =>
    toast.warn("Fill all the credentials", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const invalidCredentials = () =>
    toast.warn("Invalid email format", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const loggingIn = () =>
    toast.info("Logging in...", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleSignup = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      alert("Session Expired. Login Again");
      navigate("/admin_Login");
    } else {
      const Admin_id = userData.id;
      console.log("Id: ", Admin_id);
    }

    if (!firstname || !email || !password) {
      fillAllCredentials();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      invalidCredentials();
      return;
    }

    try {
      const response = await fetch("https://crmapi.devcir.co/api/manager_details");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();

      const emailExists = userData.some((user) => user.manager_email == email);
      if (emailExists) {
        toast.error("Email already exists. Please use a different email.");
        return;
      }

      console.log("Sending OTP to email:", email);

      const otpResponse = await fetch("https://crmapi.devcir.co/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const responseText = await otpResponse.text();
      console.log("Server response:", responseText);

      if (otpResponse.ok) {
        try {
          const result = JSON.parse(responseText);
          toast.success("OTP sent successfully!");
          console.log(result.message);
          setShowOtpForm(true);
          // loggingIn();
        } catch (error) {
          console.error("Error parsing JSON:", error);
          toast.error("Unexpected server response. Please try again.");
        }
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };


 

  const generatePassword = () => {
    const chars = "0123456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const generateUniqueCode = () => {
    const numbers = "0123456789";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let code = "";

    for (let i = 0; i < 12; i++) {
      if (i % 3 == 0 || i % 3 == 1) {
        const randomLetterIndex = Math.floor(Math.random() * letters.length);
        code += letters[randomLetterIndex];
      } else {
        const randomNumberIndex = Math.floor(Math.random() * numbers.length);
        code += numbers[randomNumberIndex];
      }
    }
    return code;
  };

  console.log(generateUniqueCode());

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const managerId = generatePassword();
    const link = generateUniqueCode();

    try {
      const otpResponse = await fetch("https://crmapi.devcir.co/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const otpResult = await otpResponse.json();
      if (otpResponse.ok) {
        console.log(otpResult.message);
        toast.success("OTP Verified successfully!");

        try {
          const encryptedPassword = CryptoJS.AES.encrypt(
            password,
            "DBBDRSSR54321"
          ).toString();

          const userData = JSON.parse(localStorage.getItem("userData"));

          if (!userData) {
            alert("Session Expired. Login Again");
            navigate("/admin_Login");
          }
          const Admin_id = userData.id;
          console.log("Id: ", Admin_id);

          const data = new FormData();
          data.append("Admin_Id", Admin_id);
          data.append("manager_name", firstname);
          data.append("manager_email", email);
          data.append("manager_password", encryptedPassword);
          data.append("manager_secret_id", parseInt(managerId));
          // data.append("senior_ops_manager_id", null);
          // data.append("head_of_sales_id:", null);
          data.append("manager_role", "Head Of Sales");

          if (image) {
            data.append("manager_image_path", image);
          }

          const payloadMail = {
            role: "Head Of Sales",
            email: email,
            link: `https://salez-up-mvp-one.vercel.app/HeadofSales/${link}`,
            password: password,
            managerId: managerId,
          };

          const response = await axios.post(
            "https://crmapi.devcir.co/api/manager_details",
            data
          );
          console.log("Registration successful:", response.data);

          try {
            const response = await fetch(
              "https://crmapi.devcir.co/api/send-link",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payloadMail),
              }
            );

            const result = await response.json();

            if (response.ok) {
              toast.success("Email Has Been Sent Successfully");
              navigate("/admin_portal_dashboard");
            } else {
              toast.error("Error Sending Email. Please Try Again Later");
            }
          } catch (error) {
            console.log("An error occurred: " + error.message);
          }
          registerSuccesful();
          alert(
            "Link has Been sent to Your Email. Use then to Link to Login to your Account"
          );
        } catch (error) {
          console.error("Error registering user:", error);
        }
      } else {
        console.error(otpResult.message);
        toast.error("OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration process:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };


 

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  //---------------------------------------------------------- Image Work ----------------------------------------------------//

  return (
    <div className="flex items-center justify-center p-4 overflow-hidden">
      <div
        className="flex flex-col gap-8 p-6 md:p-8 mt-[28px] rounded-lg w-full max-w-6xl mx-auto"
        style={{
          boxShadow:
            "0px 4px 6px rgba(29, 135, 117, 0.2), 0px -4px 6px rgba(29, 135, 117, 0.2), 4px 0px 6px rgba(29, 135, 117, 0.2), -4px 0px 6px rgba(29, 135, 117, 0.2)",
        }}
      >
        <div className="flex items-center justify-center w-full mb-2">
          <img
            src="/images/logo.png"
            alt=""
            className="w-[150px] h-[30px] cursor-pointer"
          />
        </div>

        {!showOtpForm ? (
          <>
            <div className="flex flex-col md:flex-row justify-between w-full gap-4">
              {/* Profile Image Upload Section */}
              <div className="flex items-center justify-center w-full md:w-[25%]">
                <label className="cursor-pointer">
                  <img
                    src={logo_png}
                    className="w-36 h-36 mx-auto rounded-lg shadow"
                    alt="Uploaded preview"
                  />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Input Fields Section */}
              <div className="flex flex-col w-full md:w-[50%] gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="username"
                    className="text-[#1d8775] text-base font-semibold"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full rounded-md bg-lGreen py-2 px-4 text-sm placeholder-[#8fa59c]"
                    placeholder="Enter your username"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-[#1d8775] text-base font-semibold"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md bg-lGreen py-2 px-4 text-sm placeholder-[#8fa59c]"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="flex flex-col relative">
                  <label
                    htmlFor="password"
                    className="text-[#1d8775] text-base font-semibold"
                  >
                    Password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md bg-lGreen py-2 px-4 text-sm placeholder-[#8fa59c] pr-10" // Add padding-right to avoid text overlap with the button
                      placeholder="Enter your Password"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 transform -translate-y-1/2 right-2 text-black bg-transparent "
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="commission"
                    className="text-[#1d8775] text-base font-semibold"
                  >
                    Commission
                  </label>
                  <input
                    type="text"
                    id="commission"
                    name="commission"
                    required
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-full rounded-md bg-lGreen py-2 px-4 text-sm placeholder-[#8fa59c]"
                    placeholder="Enter Commission"
                  />
                </div>
              </div>

              {/* Image Preview Section */}
              <div className="w-full md:w-[25%] flex justify-center items-center">
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt="Selected preview"
                    className="w-full max-w-[80%] h-auto border-2 rounded-md"
                  />
                ) : (
                  <div className="text-gray-500">No Image Selected</div>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full gap-4 mt-4">
              <p className="text-dGreen text-sm opacity-50 text-center">
                By Clicking{" "}
                <span className="cursor-pointer text-[#009245]">
                  “Create Account”
                </span>{" "}
                you agree to our terms and privacy policy
              </p>
              <div className="flex justify-end w-full">
                <button
                  onClick={handleSignup}
                  className="bg-themeGreen rounded-md text-sm font-medium w-36 h-10"
                >
                  <span className="text-white">Create Account</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <form className="space-y-4 w-full" onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                An OTP has been sent to your email address. Please enter it
                below to verify your account.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-black border-2 border-[#007AAFF7] bg-white rounded-md hover:bg-[#007AAFF7] hover:text-white"
            >
              VERIFY OTP
            </button>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Head_of_sales_SignUp;
