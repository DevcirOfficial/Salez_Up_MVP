import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CryptoJS from "crypto-js";
import axios from "axios";
import { BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo_png from "./image.jpg";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const Senior_Ops_manager_SignUp = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [commission, setCommission] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [options, setOptions] = useState([]);
  const [managerId, setManagerId] = useState();
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

  useEffect(() => {
    const fetchManagerDetails = async () => {

      try {
        const response = await axios.get(
          "https://crmapi.devcir.co/api/manager_details"
        );
        const filteredData = response.data.filter(
          (manager) =>
            manager.manager_role == "Head Of Sales" && manager.Admin_Id == id
        );
        const fetchedOptions = filteredData.map((manager) => ({
          value: manager.id,
          label: manager.manager_name,
        }));
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching manager details:", error);
      }
    };

    fetchManagerDetails();
  }, []);

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

  const noHeadOfSales = () =>
    toast.error("No Head of Sales assigned to this Senior Ops Manager", {
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
      const response = await fetch(
        "https://crmapi.devcir.co/api/manager_details"
      );
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

    const managerSecretId = generatePassword();
    const link = generateUniqueCode();

    try {
      const otpResponse = await fetch(
        "https://crmapi.devcir.co/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

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
          data.append("manager_name", firstname);
          data.append("Admin_Id", Admin_id);
          if (image) {
            data.append("manager_image_path", image);
          }
          if (commission) {
            data.append("manager_commision", commission);
          }
          data.append("manager_email", email);
          data.append("manager_password", encryptedPassword);
          data.append("manager_secret_id", parseInt(managerSecretId));
          if (managerId) {
            data.append("head_of_sales_id", managerId);
          }
          data.append("manager_role", "Senior Ops Manager");

          const payloadMail = {
            role: "Senior Ops Manager",
            email: email,
            link: `https://salez-up-mvp.vercel.app/SeniorOpsManager_SignIn/${link}`,
            password: password,
            managerId: managerSecretId,
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
          // navigate('/')
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
    <div className="flex items-center justify-center p-8 pt-24 overflow-hidden">
      <div
        className="flex flex-col gap-8 p-6 md:p-8 mt-[-48px] rounded-lg w-full max-w-6xl mx-auto"
        style={{
          boxShadow:
            "0px 4px 6px rgba(29, 135, 117, 0.2), 0px -4px 6px rgba(29, 135, 117, 0.2), 4px 0px 6px rgba(29, 135, 117, 0.2), -4px 0px 6px rgba(29, 135, 117, 0.2)",
        }}
      >
        <div className="flex items-center justify-center w-full mb-2 ">
          <img
            src="/images/logo.png"
            alt=""
            className="w-[197px] h-[40px] cursor-pointer"
          />
        </div>

        {!showOtpForm ? (
          <>
            <div className="flex flex-row justify-between w-full gap-4 mt-2 ">
              <div className="flex items-center justify-center w-[28%]">
                <div className="w-[80%] p-4 gap-10 ">
                  <label className="items-center justify-center cursor-pointer">
                    <div>
                      <div>
                        <img
                          src={imagePath || logo_png}
                          className="w-44 h-44 mx-auto rounded-[20px] shadow cursor-pointer"
                          alt="Uploaded preview"
                        />
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Input fields section */}

              <div className="w-[55%] flex-col space-y-6">
                {/* Row 1 */}
                <div className="flex flex-row space-x-6">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="username"
                      className="text-[#1d8775] text-[16px] font-[600] leading-[27px]"
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
                      className="w-full rounded-[6px] text-black bg-lGreen py-[12px] px-[16px] font-[500] h-[45px] text-[14px] placeholder-[#8fa59c]"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="email"
                      className="text-[#1d8775] text-[16px] font-[600] leading-[27px]"
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
                      className="w-full rounded-[6px] text-dGreen bg-lGreen py-[12px] px-[16px] font-[500] h-[45px] text-[14px] placeholder-[#8fa59c]"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex flex-row space-x-6">
                  <div className="relative flex flex-col w-1/2">
                    <label
                      htmlFor="password"
                      className="text-[#1d8775] text-[16px] font-[600] leading-[27px]"
                    >
                      Password
                    </label>

                    <div className="relative w-full">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-[6px] text-dGreen bg-lGreen py-[12px] px-[16px] pr-10 font-[500] h-[45px] text-[14px] placeholder-[#8fa59c]"
                        placeholder="Enter your Password"
                      />

                      <button
                        type="button"
                        className="absolute inset-y-0 flex items-center text-black right-3 hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="commission"
                      className="text-[#1d8775] text-[16px] font-[600] leading-[27px]"
                    >
                      Commission
                    </label>
                    <input
                      type="text"
                      id="commission"
                      name="commission"
                      required
                      value={commission}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value)) {
                          setCommission(value);
                        }
                      }}
                      className="w-full rounded-[6px] text-dGreen bg-lGreen py-[12px] px-[16px] font-[500] h-[45px] text-[14px] placeholder-[#8fa59c]"
                      placeholder="Enter Commission"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex flex-row space-x-6">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="ManagerId"
                      className="text-[#1d8775] text-[16px] font-[600] leading-[27px]"
                    >
                      Head Of Sales
                    </label>
                    <Select
                      options={options}
                      onChange={(selectedOption) =>
                        setManagerId(selectedOption.value)
                      }
                      className="w-full text-dGreen bg-lGreen font-[500] text-[14px] placeholder-[#8fa59c]"
                      placeholder="Select Head Of Sales"
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: "45px",
                          borderRadius: "6px",
                          padding: "0 16px",
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Image preview section */}
              <div className="w-[25%] p-4 flex justify-center items-center ">
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt="Selected preview"
                    className="w-full h-auto border-2 rounded-md"
                  />
                ) : (
                  <div className="text-gray-500">No Image Selected</div>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full gap-[16px] mt-2">
              <p className="text-dGreen text-[14px] opacity-50">
                By Clicking{" "}
                <span className="cursor-pointer text-[#009245]">
                  “Create Account”
                </span>{" "}
                you agree to our terms and privacy policy
              </p>
              <div className="flex justify-end w-full">
                <button
                  onClick={handleSignup}
                  className="bg-themeGreen rounded-[10px] font-[500] leading-[24px] tracking-[1%] text-[16px] [box-shadow:0px_8px_8px_0px_#40908433] w-[150px] h-[36px]"
                >
                  <span className="text-white">Create Account</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <form className="space-y-4" onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-600">
                An OTP has been sent to your email address. Please enter it
                below to verify your account.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AAFF7]"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 font-semibold text-black border-[#007AAFF7] border-2 pt-4 pb-4 bg-white rounded-md hover:bg-[#007AAFF7] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#007AAFF7] focus:ring-offset-2"
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

export default Senior_Ops_manager_SignUp;
