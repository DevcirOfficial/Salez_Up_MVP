
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from "axios";
import { BiLogIn } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Head_of_sales_SignUp = () => {
  const navigate = useNavigate();
  const [head_of_sales_name, setHeadofSalesName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [commission, setCommission] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');

  const registerSuccesful = () => toast.success('Successfully registered', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const fillAllCredentials = () => toast.warn('Fill all the credentials', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const invalidCredentials = () => toast.warn('Invalid email format', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const loggingIn = () => toast.info('Logging in...', {
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

    if (!head_of_sales_name || !email || !password) {
      fillAllCredentials();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      invalidCredentials();
      return;
    }

    try {
      const response = await fetch('https://crmapi.devcir.co/api/head_of_sales');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();

      const emailExists = userData.some(user => user.email == email);
      if (emailExists) {
        toast.error('Email already exists. Please use a different email.');
        return;
      }

      console.log('Sending OTP to email:', email);

      const otpResponse = await fetch('https://crmapi.devcir.co/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const responseText = await otpResponse.text();
      console.log('Server response:', responseText);

      if (otpResponse.ok) {
        try {
          const result = JSON.parse(responseText);
          toast.success('OTP sent successfully!');
          console.log(result.message);
          setShowOtpForm(true);
          loggingIn();
        } catch (error) {
          console.error('Error parsing JSON:', error);
          toast.error('Unexpected server response. Please try again.');
        }
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  }

  const generatePassword = () => {
    const chars = '0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const generateUniqueCode = () => {
    const numbers = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let code = '';
  
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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const head_of_sales_secret_id = generatePassword();
    const link = generateUniqueCode();

    try {
      const otpResponse = await fetch('https://crmapi.devcir.co/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const otpResult = await otpResponse.json();
      if (otpResponse.ok) {
        console.log(otpResult.message);
        toast.success('OTP Verified successfully!');

        try {
          const encryptedPassword = CryptoJS.AES.encrypt(password, 'DBBDRSSR54321').toString();
          const formData = {
            head_of_sales_name: head_of_sales_name,
            email: email,
            password: encryptedPassword,
            commission: 10,
            head_of_sales_secret_id: parseInt(head_of_sales_secret_id)
          };

          const payloadMail = {
            role: "Head of Sales",
            email: email,
            link: `https://crmapi.devcir.co/HeadofSales/${link}`,
            password: password,
            managerId: head_of_sales_secret_id
          }

          const response = await axios.post("https://crmapi.devcir.co/api/head_of_sales", formData);
          console.log("Registration successful:", response.data);

          try {
            const response = await fetch('https://crmapi.devcir.co/api/send-link3', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payloadMail),
            });

            const result = await response.json();

            if (response.ok) {
              toast.success('Email Has Been Sent Successfully');
            } else {
              toast.error('Error Sending Email. Please Try Again Later');
            }
          } catch (error) {
            console.log('An error occurred: ' + error.message);
          }
          registerSuccesful();
          alert("Link has Been sent to Your Email. Use then to Link to Login to your Account")
        //   navigate('/ops_manager_sign-in')

        } catch (error) {
          console.error("Error registering user:", error);
        }

      } else {
        console.error(otpResult.message);
        toast.error('OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration process:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className='flex items-center justify-center h-screen p-4'>
      <div className='flex flex-col gap-[36px] p-[40px] rounded-[20px] w-[644px] [box-shadow:-3px_8px_20px_0px_#1E86751F] items-center'>
        <img src="/images/logo.png" alt="" className='w-[197px] h-[40px] cursor-pointer' />

        {!showOtpForm ? (
          <>
            <div className="w-full flex flex-col gap-[15px]">
              <div className='w-full flex flex-col gap-[18px]'>
                <label htmlFor="username" className='text-dGreen text-[18px] font-[400] leading-[27px]'>Username</label>
                <input
                  type="text"
                  id='username'
                  name='username'
                  required
                  value={head_of_sales_name}
                  onChange={(e) => setHeadofSalesName(e.target.value)}
                  className='w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c]' 
                  placeholder='Enter your username' 
                />
              </div>
              <div className='w-full flex flex-col gap-[15px]'>
                <label htmlFor="email" className='text-dGreen text-[18px] font-[400] leading-[27px]'>Email</label>
                <input
                  type="email"
                  id='email'
                  name='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c]' 
                  placeholder='Enter your email' 
                />
              </div>
              <div className="w-full flex flex-col gap-[15px] relative">
                <label htmlFor="password" className='text-dGreen text-[18px] font-[400] leading-[27px]'>Password</label>
                <input
                  className="w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c]"
                  placeholder="Enter your Password"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute text-black bg-transparent top-14 right-4 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className='flex flex-col w-full gap-[16px]'>
              <p className='text-dGreen text-[14px] opacity-50'>By Clicking <span className='cursor-pointer text-[#009245]'>"Create Account"</span> you agree to our terms and privacy policy</p>
              <div className='flex justify-end w-full'>
                <button 
                  onClick={handleSignup} 
                  className='bg-themeGreen rounded-[10px] font-[500] leading-[24px] tracking-[1%] text-[16px] [box-shadow:0px_8px_8px_0px_#40908433] w-[150px] h-[36px]'
                >
                  <span className='text-white'>Create Account</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <form className="space-y-4" onSubmit={handleOtpSubmit}>
              <div className="mb-4">
                <p className="mb-2 text-sm text-gray-600">
                  An OTP has been sent to your email address. Please enter it below to verify your account.
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
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Head_of_sales_SignUp;