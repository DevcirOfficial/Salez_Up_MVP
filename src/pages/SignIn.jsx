import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './signin.css';
import { FaUserPen } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {

  const { roleId } = useParams();
  const [type, setType] = useState('');

  console.log("Role : ", roleId)

  const isTeamLeaderPattern = (roleId) => {
    for (let i = 0; i < roleId.length; i++) {
      const char = roleId[i];
      if (i % 2 == 0) {
        if (!/[0-9]/.test(char)) return false; // Even indices: must be a number
      } else {
        if (!/[a-zA-Z]/.test(char)) return false; // Odd indices: must be a letter
      }
    }
    return true;
  };

  const isSalesAgentPattern = (roleId) => {
    for (let i = 0; i < roleId.length; i++) {
      const char = roleId[i];
      if (i % 2 == 0) {
        // Even index: must be a letter
        if (!/[a-zA-Z]/.test(char)) return false;
      } else {
        // Odd index: must be a number
        if (!/[0-9]/.test(char)) return false;
      }
    }
    return true;
  };

  // Validation for "Manager" roleId (2 letters at odd positions followed by a number at every even position, total length 12)
  const isManagerPattern = (roleId) => {
    // Ensure the roleId is exactly 12 characters long
    if (roleId.length != 12) return false;

    for (let i = 0; i < roleId.length; i++) {
      const char = roleId[i];

      if ((i + 1) % 3 == 0) {
        // Every third position (3, 6, 9, 12) must be a number
        if (!/[0-9]/.test(char)) return false;
      } else {
        // All other positions must be letters (both uppercase and lowercase)
        if (!/[a-zA-Z]/.test(char)) return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (isTeamLeaderPattern(roleId)) {
      setType('Team Leader'); // Set the type to 'Team Leader' if the pattern matches
    } else if (isSalesAgentPattern(roleId)) {
      setType('Sales Agent'); // Set the type to 'Sales Agent' if the pattern matches
    } else if (isManagerPattern(roleId)) {
      setType('Manager'); // Set the type to 'Manager' if the pattern matches
    }
  }, [roleId]);

  console.log("Type::", type);

  const validRoleIdLength = /^[a-zA-Z0-9]{8}$|^[a-zA-Z0-9]{12}$/;
  if (!validRoleIdLength.test(roleId)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-red-500">404 Not Found</h1>
      </div>
    );
  }

  const loginSuccessful = () => toast.success('Successfully loggedIn', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const fillAllCredentials = () => toast.warn('Kindly fill all the credentials', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const invalidCredentials = () => toast.error('Invalid credentials', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const wrongCombination = () => toast.error('Wrong email and password combination', {
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

  const navigate = useNavigate();



  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [managerId, setManagerId] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSignin = async (e) => {
    e.preventDefault();
    console.log(type); // Logs the role

    if (type == "Manager") {
      if (!email || !password || !managerId) {
        fillAllCredentials();
        return;
      }
    } else {
      if (!email || !password) {
        fillAllCredentials();
        return;
      }
    }

    // loggingIn();

    try {
      // Fetch and set the filtered data before proceeding
      const filteredData = await fetchData(type);

      let foundUser = false;

      if (type == "Manager") {
        foundUser = filteredData.find(user => user.email == email && user.manager_secret_id == managerId);
      } else {
        foundUser = filteredData.find(user => user.email == email);
      }

      if (foundUser) {
        console.log(`Found Pass ${CryptoJS.AES.decrypt(foundUser.password, 'DBBDRSSR54321').toString(CryptoJS.enc.Utf8)}`)
        const decryptedPassword = type == 'Manager'
          ? CryptoJS.AES.decrypt(foundUser.password, 'DBBDRSSR54321').toString(CryptoJS.enc.Utf8)
          :  CryptoJS.AES.decrypt(foundUser.password, 'DBBDRSSR54321').toString(CryptoJS.enc.Utf8); // Use plain password for other roles
        console.log("pass: ", password)
        if (password === decryptedPassword) {
          console.log("Decrypted Password: ", decryptedPassword);
          console.log("----  Right User ----");
          console.log("my user: ", foundUser);
          loginSuccessful();

          // New POST API request before navigation
          try {
            const response = await fetch('https://crmapi.devcir.co/api/sendloginMessage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: email,
                role: type
              })
            });

            if (response.ok) {
              console.log('API POST request successful');
            } else {
              console.error('Failed to make POST request');
            }
          } catch (error) {
            console.error('Error making POST request:', error);
          }

          // Navigate based on role
          if (type == "Manager") {
            navigate('/dashboard', { state: { foundUser } });
          }
          else if (type == "Team Leader") {
            navigate('/TeamLeader_main_dashboard', { state: { foundUser } });
          }
          else if (type == "Sales Agent") {
            navigate('/SalesAgent_main_dashboard', { state: { foundUser } });
          }

          if (type == "Manager") {
            localStorage.setItem('userEmail', foundUser.email);
            localStorage.setItem('userFName', foundUser.manager_name);
            localStorage.setItem('id', foundUser.id);
          }
          else if (type == "Team Leader") {
            localStorage.setItem('userEmail', foundUser.email);
            localStorage.setItem('userFName', `${foundUser.first_name} ${foundUser.last_name}`);
            localStorage.setItem('id', foundUser.id);
            localStorage.setItem('managerRole', "Team Leader");
            localStorage.setItem('Teamleader_Image', JSON.stringify(foundUser.image_path));
          }
          else if (type == "Sales Agent") {
            const kpi = JSON.parse(foundUser.kpi_data)
            localStorage.setItem('userEmail', foundUser.email);
            localStorage.setItem('userFName', `${foundUser.first_name} ${foundUser.last_name}`);
            localStorage.setItem('id', foundUser.id);
            localStorage.setItem('Team_id', foundUser.team_id);
            localStorage.setItem('managerRole', "Sales Agent");
            localStorage.setItem("commission_salesagent", `${kpi.teamInfo.opportunity}`);
            localStorage.setItem("frequency_salesagent", `${kpi.teamInfo.frequency}`);  
            localStorage.setItem("currency", `${kpi.teamInfo.currency}`);  
            localStorage.setItem('Agents_KPI_Data',JSON.stringify(kpi.teamInfo));
            localStorage.setItem('SalesAgent_Image', JSON.stringify(foundUser.image_path));
          }
          
          

          // Store user info in local storage

          console.log("This is my email: ", foundUser.email);
          setIsAdminLoggedIn(true);

        } else {
          console.log("----  Wrong Password  ----");
          invalidCredentials();
        }
      } else {
        wrongCombination();
        const foundPassword = filteredData.some(user => {
          const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'DBBDRSSR54321').toString(CryptoJS.enc.Utf8);
          return password == decryptedPassword;
        });

        if (foundPassword) {
          console.log("----  Wrong Email  ----");
          invalidCredentials();
        } else {
          console.log("----  Wrong Email and Password Combination  ----");
          wrongCombination();
        }
      }
    } catch (error) {
      console.error('Error during login process:', error);
    }
  };

  // Updated fetchData function to accept a role and request different APIs
  const fetchData = async (role) => {
    let apiUrl;
    // Check the role and set the appropriate API endpoint
    if (role == 'Manager') {
      apiUrl = 'https://crmapi.devcir.co/api/managers';
    } else if (role == 'Sales Agent') {
      apiUrl = 'https://crmapi.devcir.co/api/sales_agents';
    } else if (role == 'Team Leader') {
      apiUrl = 'https://crmapi.devcir.co/api/team_leaders';
    } else {
      throw new Error('Invalid role');
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);

      // Map the data appropriately based on role
      if (role == "Manager") {
        return data.map(({ id, email, password, manager_name, manager_secret_id }) => ({ id, email, password, manager_name, manager_secret_id }));
      } else {
        return data.map(({ id, email, password, first_name, last_name, kpi_data, team_id, image_path }) => ({ id, email, password, first_name, last_name, kpi_data, team_id, image_path }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };



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
              id='email' name='email'
              className='w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c]' placeholder='Enter your email' />
          </div>

          <div className="w-full flex flex-col gap-[15px]">
            <label htmlFor="password" className='text-dGreen text-[18px] font-[400] leading-[27px]'>Password</label>
            <input
              className="w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c]"
              placeholder="Enter your Password"
              type={isPasswordVisible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          {type == "Manager" && (
            <div className="w-full flex flex-col gap-[15px]">
              <label htmlFor="managerId" className='text-dGreen text-[18px] font-[400] leading-[27px]'>Unique Manager Id</label>
              <input
                className="w-full rounded-[6px] text-dGreen bg-lGreen p-0 py-[12px] px-[16px] font-[500] h-[45px] border-none leading-[21px] text-[14px] placeholder-[#8fa59c]"
                placeholder="Enter your Unique Manager Id"
                type="text"
                required
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
              />
            </div>
          )}

        </div>
        <div className='flex justify-between w-full'>
          {type == "Manager" && (<p onClick={() => { navigate('/ForgotPassword') }} className='flex items-center ml-2 text-sm font-semibold underline text-themeGreen hover:no-underline cursor-pointer'>Forgot Password</p>)}
          <button onClick={handleSignin} className='bg-themeGreen rounded-[10px] font-[500] leading-[24px] tracking-[1%] text-[16px] [box-shadow:0px_8px_8px_0px_#40908433] w-[107px] h-[36px]'><span className='text-white'>Login</span></button>
        </div>


        {type == "Manager" && (
          <div className='flex items-center justify-center w-full p-4 '>
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
          </div>
        )}




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
        theme="light" />
    </div>
  )
}

export default SignIn