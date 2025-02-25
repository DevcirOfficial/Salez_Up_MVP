import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";
// import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import { BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import logo_png from "./image.jpg";

const Ops_Manager_SignUp = () => {
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
  const [headOfSalesName, setHeadOfSalesName] = useState({
    name: "",
    id: null,
  });
  const [allManagerData, setAllManagerData] = useState([]);

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
      const data = JSON.parse(localStorage.getItem("userData"));
      const id = data.id;

      try {
        const response = await axios.get(
          "https://crmapi.devcir.co/api/manager_details"
        );
        const allData = response.data;
        setAllManagerData(allData);

        const filteredData = allData.filter(
          (manager) =>
            manager.manager_role == "Senior Ops Manager" &&
            manager.Admin_Id == id
        );

        const fetchedOptions = filteredData.map((manager) => ({
          value: manager.id,
          label: manager.manager_name,
          head_of_sales_id: manager.head_of_sales_id,
        }));

        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching manager details:", error);
      }
    };

    fetchManagerDetails();
  }, []);

  const handleManagerSelect = async (selectedOption) => {
    setManagerId(selectedOption.value);

    if (selectedOption.value == null) {
      setHeadOfSalesName({
        name: "",
        id: null,
      });
      return;
    }
    if (selectedOption.head_of_sales_id) {
      const headOfSales = allManagerData.find(
        (manager) => manager.id == selectedOption.head_of_sales_id
      );
      if (headOfSales) {
        setHeadOfSalesName({
          name: headOfSales.manager_name,
          id: selectedOption.head_of_sales_id,
        });
        console.log("Head of Sales ID:", selectedOption.head_of_sales_id);
      }
    } else {
      setHeadOfSalesName({
        name: "",
        id: null,
      });
      toast.info("No Head of Sales assigned to this Senior Ops Manager");
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

  // const handleOtpSubmit = async (e) => {
  //   e.preventDefault();

  //   const managerSecretId = generatePassword();
  //   const link = generateUniqueCode();

  //   const navigate = useNavigate();

  //   try {
  //     const otpResponse = await fetch("https://crmapi.devcir.co/api/verify-otp", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, otp }),
  //     });

  //     const otpResult = await otpResponse.json();
  //     if (otpResponse.ok) {
  //       console.log(otpResult.message);
  //       toast.success("OTP Verified successfully!");

  //       try {
  //         const encryptedPassword = CryptoJS.AES.encrypt(
  //           password,
  //           "DBBDRSSR54321"
  //         ).toString();

  //         const userData = JSON.parse(localStorage.getItem("userData"));

  //         if (!userData) {
  //           alert("Session Expired. Login Again");
  //           navigate("/admin_Login");
  //         }
  //         const Admin_id = userData.id;
  //         console.log("Id: ", Admin_id);

  //         const data = new FormData();
  //         data.append("manager_name", firstname);
  //         data.append("Admin_Id", Admin_id);
  //         if (image) {
  //           data.append("manager_image_path", image);
  //         }
  //         if (commission) {
  //           data.append("manager_commision", commission);
  //         }
  //         data.append("manager_email", email);
  //         data.append("manager_password", encryptedPassword);
  //         data.append("manager_secret_id", parseInt(managerSecretId));
  //         if (managerId) {
  //           data.append("senior_ops_manager_id", managerId);
  //         }
  //         // Add head_of_sales_id if it exists
  //         if (headOfSalesName.id) {
  //           data.append("head_of_sales_id", headOfSalesName.id);
  //         }
  //         data.append("manager_role", "Ops Manager");

  //         const payloadMail = {
  //           role: "Ops Manager",
  //           email: email,
  //           link: `https://crmapi.devcir.co/OpsManager_SignIn/${link}`,
  //           password: password,
  //           managerId: managerSecretId,
  //         };

  //         const response = await axios.post(
  //           "https://crmapi.devcir.co/api/manager_details",
  //           data
  //         );
  //         console.log("Registration successful:", response.data);

  //         try {
  //           const response = await fetch(
  //             "https://crmapi.devcir.co/api/send-link",
  //             {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify(payloadMail),
  //             }
  //           );

  //           const result = await response.json();

  //           if (response.ok) {
  //             toast.success("Email Has Been Sent Successfully");
  //             navigate("/admin_portal_dashboard");
  //           } else {
  //             toast.error("Error Sending Email. Please Try Again Later");
  //           }
  //         } catch (error) {
  //           console.log("An error occurred: " + error.message);
  //         }
  //         registerSuccesful();
  //         alert(
  //           "Link has Been sent to Email. Use then to Link to Login to your Account"
  //         );
  //         // navigate('/')
  //       } catch (error) {
  //         console.error("Error registering user:", error);
  //       }
  //     } else {
  //       console.error(otpResult.message);
  //       toast.error("OTP verification failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error during registration process:", error);
  //     toast.error("An error occurred. Please try again later.");
  //   }
  // };


  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const managerSecretId = generatePassword();
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
          const encryptedPassword = CryptoJS.AES.encrypt(password, "DBBDRSSR54321").toString();
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
            data.append("senior_ops_manager_id", managerId);
          }
          // Add head_of_sales_id if it exists
          if (headOfSalesName.id) {
            data.append("head_of_sales_id", headOfSalesName.id);
          }
          data.append("manager_role", "Ops Manager");

          const payloadMail = {
            role: "Ops Manager",
            email: email,
            link: `https://salez-up-mvp.vercel.app/OpsManager_SignIn/${link}`,
            password: password,
            managerId: managerSecretId,
          };

          const response = await axios.post("https://crmapi.devcir.co/api/manager_details", data);
          console.log("Registration successful:", response.data);

          try {
            const response = await fetch("https://crmapi.devcir.co/api/send-link", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payloadMail),
            });

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
          alert("Link has Been sent to Email. Use then to Link to Login to your Account");
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
      <div className="flex flex-col gap-8 p-6 md:p-8 mt-[-48px] rounded-lg w-full max-w-6xl mx-auto"
  style={{
    boxShadow: '0px 4px 6px rgba(29, 135, 117, 0.2), 0px -4px 6px rgba(29, 135, 117, 0.2), 4px 0px 6px rgba(29, 135, 117, 0.2), -4px 0px 6px rgba(29, 135, 117, 0.2)'
  }}>
        <div className="flex items-center justify-center w-full">
          <img
            src="/images/logo.png"
            alt=""
            className="w-48 h-auto cursor-pointer"
          />
        </div>

        {!showOtpForm ? (
          <>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left section - Profile Image */}
              <div className="w-full md:w-1/5">
                <label className="block cursor-pointer">
                  <div className="flex justify-center">
                    <img
                      // src={imagePath || logo_png}
                      src={logo_png}
                      className="w-40 h-40 rounded-lg shadow object-cover"
                      alt="Uploaded preview"
                    />
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Middle section - Form Fields */}
              <div className="w-full md:w-3/5 space-y-6">
                {/* Username and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#1d8775] text-base font-semibold mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="w-full rounded text-black bg-lGreen p-3 text-base"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1d8775] text-base font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded text-black bg-lGreen p-3 text-base"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                {/* Password and Commission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#1d8775] text-base font-semibold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded text-black bg-lGreen p-3 pr-12 text-base"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? (
                          <FaEyeSlash className="text-themeGreen" />
                        ) : (
                          <FaEye className="text-themeGreen" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#1d8775] text-base font-semibold mb-2">
                      Commission
                    </label>
                    <input
                      type="text"
                      value={commission}
                      onChange={(e) => {
                        if (/^[0-9]*$/.test(e.target.value)) {
                          setCommission(e.target.value);
                        }
                      }}
                      className="w-full rounded text-black bg-lGreen p-3 text-base"
                      placeholder="Enter commission"
                    />
                  </div>
                </div>

                {/* Manager Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#1d8775] text-base font-semibold mb-2">
                      Select Senior Ops Manager
                    </label>
                    <Select
                      options={[
                        { value: null, label: "Select Head of Sales" },
                        ...options,
                      ]}
                      onChange={handleManagerSelect}
                      className="text-base"
                      placeholder="Select Ops Manager"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "45px",
                          borderRadius: "0.375rem",
                        }),
                      }}
                    />
                  </div>
                  {headOfSalesName.name && (
                    <div>
                      <label className="block text-[#1d8775] text-base font-semibold mb-2">
                        Head of Sales
                      </label>
                      <input
                        type="text"
                        value={headOfSalesName.name}
                        disabled
                        className="w-full rounded text-black bg-lGreen p-3 text-base"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right section - Image Preview */}
              <div className="w-full md:w-1/5 flex justify-center items-start">
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt="Selected preview"
                    className="w-full max-w-[180px] h-auto rounded-lg shadow"
                  />
                ) : (
                  <div className="text-gray-500 text-base">
                    No Image Selected
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-base text-gray-600">
                By Clicking{" "}
                <span className="text-[#009245] cursor-pointer">
                  "Create Account"
                </span>{" "}
                you agree to our terms and privacy policy
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleSignup}
                  className="bg-themeGreen text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-opacity-90 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full max-w-lg mx-auto">
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div>
                <p className="text-base text-gray-600 mb-3">
                  An OTP has been sent to your email address. Please enter it
                  below to verify your account.
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AAFF7]"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 text-black border-[#007AAFF7] border-2 bg-white rounded-md hover:bg-[#007AAFF7] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AAFF7] focus:ring-offset-2"
              >
                VERIFY OTP
              </button>
            </form>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Ops_Manager_SignUp;
