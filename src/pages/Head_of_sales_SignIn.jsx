import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './signin.css';
import { FaUserPen } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Ops_manager_SignIn = () => {
  const { roleId } = useParams();
  const [type, setType] = useState('');
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headOfSalesId, setHeadOfSalesId] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };


  const isHeadOfSalesPattern = (roleId) => {
    if (!roleId) return false;
    if (roleId.length != 12) return false;

    for (let i = 0; i < roleId.length; i++) {
      const char = roleId[i];
      if ((i + 1) % 3 == 0) {
        if (!/[0-9]/.test(char)) return false;
      } else {
        if (!/[a-zA-Z]/.test(char)) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (roleId && isHeadOfSalesPattern(roleId)) {
      setType('Head of Sales');
    }
  }, [roleId]);

  // Toast notifications
  const showToast = {
    success: () => toast.success('Successfully logged in', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }),
    warning: () => toast.warn('Kindly fill all the credentials', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }),
    error: (message) => toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }),
    info: () => toast.info('Logging in...', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    })
  };



  const handleSignin = async (e) => {
    e.preventDefault();
  
    // Validation
    if (!email || !password || !headOfSalesId) {
      showToast.warning();
      return;
    }
  
    showToast.info();
  
    try {
      // Fetch ops managers data
      const response = await fetch('https://crmapi.devcir.co/api/manager_details');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const numericHeadOfSalesId = Number(headOfSalesId);
  
      const foundUser = data.find(
        user => user.	manager_email == email && user.manager_secret_id == numericHeadOfSalesId
      );
  
      console.log("Found User: ", foundUser);
  
      if (!foundUser) {
        showToast.error('Invalid credentials');
        return;
      }
  
      const decryptedBytes = CryptoJS.AES.decrypt(foundUser.manager_password, 'DBBDRSSR54321').toString(CryptoJS.enc.Utf8)
      
  
      console.log("Decrypted Password from DB: ", decryptedBytes);
      console.log("Entered Password: ", password);
  
      if (password != decryptedBytes) {
        showToast.error('Invalid password');
        return;
      }

      showToast.success();
  
      try {
        await fetch('https://crmapi.devcir.co/api/sendloginMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            role: 'Head of Sales'
          })
        });
      } catch (error) {
        console.error('Error sending login message:', error);
      }
  
      // Store user data
      localStorage.setItem('userEmail', foundUser.manager_email);
      localStorage.setItem('userFName', foundUser.manager_name);
      localStorage.setItem('managerRole', foundUser.manager_role);
      localStorage.setItem('managerImage', foundUser.manager_image_path);
      localStorage.setItem('id', foundUser.id);
  
      // Navigate to dashboard with user data
      navigate('/dashboard', {
        state: {
          foundUser: {
            ...foundUser,
            role: 'Head of Sales'
          }
        }
      });
  
    } catch (error) {
      console.error('Error during login process:', error);
      showToast.error('Login failed. Please try again.');
    }
  };
  
  
  // 404 check
  const validRoleIdLength = /^[a-zA-Z0-9]{12}$/;
  if (!roleId || !validRoleIdLength.test(roleId)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-red-500">404 Not Found</h1>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center h-screen p-4'>
      <div className='flex flex-col gap-[36px] p-[40px] rounded-[20px] w-[644px] [box-shadow:-3px_8px_20px_0px_#1E86751F] items-center'>
        <img src="/images/logo.png" alt="" className='w-[197px] h-[40px] cursor-pointer' />
        <div className="w-full gap-[18px] flex flex-col">
          
          <div className='w-full flex flex-col gap-[15px] relative'>
            <label htmlFor="email" className='text-dGreen text-[18px] font-[400] leading-[27px]'>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id='email'
              name='email'
              className='w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c]'
              placeholder='Enter your email'
            />
          </div>

          {/* <div className="w-full flex flex-col gap-[15px]">
            <label htmlFor="password" className='text-dGreen text-[18px] font-[400] leading-[27px]'>Password</label>
            <input
              className="w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c]"
              placeholder="Enter your Password"
              type={isPasswordVisible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div> */}

<div className="w-full flex flex-col gap-[15px]">
      <label
        htmlFor="password"
        className="text-dGreen text-[18px] font-[400] leading-[27px]"
      >
        Password
      </label>
      <div className="relative">
        <input
          className="w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c] pr-[40px]" // Padding for toggle button space
          placeholder="Enter your Password"
          type={isPasswordVisible ? "text" : "password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-[12px] top-1/2 transform -translate-y-1/2 text-lg text-themeGreen"
        >
          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>

          <div className="w-full flex flex-col gap-[15px]">
            <label htmlFor="opsManagerId" className='text-dGreen text-[18px] font-[400] leading-[27px]'>Unique Head Of Sales Id</label>
            <input
              className="w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c]"
              placeholder="Enter your Unique Ops Manager Id"
              type="text"
              required
              value={headOfSalesId}
              onChange={(e) => setHeadOfSalesId(e.target.value)}
            />
          </div>
        </div>

        <div className='flex justify-end w-full'>
          {/* <p onClick={() => navigate('/ForgotPassword')} className='flex items-center ml-2 text-sm font-semibold underline text-themeGreen hover:no-underline cursor-pointer'>
            Forgot Password
          </p> */}
          <button onClick={handleSignin} className='bg-themeGreen rounded-[10px] font-[500] leading-[24px] tracking-[1%] text-[16px] [box-shadow:0px_8px_8px_0px_#40908433] w-[107px] h-[36px]'>
            <span className='text-white'>Login</span>
          </button>
        </div>

        {/* <div className='flex items-center justify-center w-full p-4'>
          <p className='flex items-center font-medium text-center text-dGreen text-md'>
            New to SalezUp?
            <Link
              to='/sign-up'
              className='flex items-center ml-2 text-sm font-semibold underline text-themeGreen hover:no-underline'
              style={{ textDecorationThickness: '2px' }}
            >
              Register Now <FaUserPen className='ml-2 text-xl text-dGreen' />
            </Link>
          </p>
        </div> */}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Ops_manager_SignIn;