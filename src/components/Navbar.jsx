// import React, { useEffect, useState } from "react";
// import { LogOut, Lock, Settings } from "lucide-react";
// import { FaChevronDown, FaBell } from "react-icons/fa";
// import img from "../../public/images/image.jpg";
// import { toast, ToastContainer } from "react-toastify";
// import fallbackImage from "/public/images/image_not_1.jfif";

// const Navbar = () => {
//   const [profilePic, setProfilePic] = useState();
//   const [image, setImage] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const defaultImage = fallbackImage;

//  useEffect(() => {
//     const storedImage = localStorage.getItem("SalesAgent_Image");
//     if (storedImage) {
//       try {
//         const imagePath = JSON.parse(storedImage);
//         setImage(imagePath);
//       } catch (error) {
//         console.error("Error parsing image path:", error);
//         setImage(defaultImage);
//       }
//     } else {
//       setImage(defaultImage);
//     }
//   }, []);

//   useEffect(() => {
//     const images = localStorage.getItem("managerImage");
//     if (images == "null") {
//       setProfilePic(img);
//       return;
//     } else {
//       setProfilePic(images);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     toast.success("Logout Successfully");
//     window.close();
//   };

//   const handleOptionClick = (action) => {
//     setIsDropdownOpen(false);
//     switch(action) {
//       case 'changeProfile':
//         break;
//       case 'changePassword':
//         break;
//       case 'settings':
//         break;
//       default:
//         break;
//     }
//   };

//   return (
    
//     <>
//       <nav className="flex md:flex-row flex-col items-center justify-between py-[20px] px-[30px]">
//         <div>
//           <img src="/images/logo.png" alt="" className="w-[197px] h-[40px] ml-[-20px]" />
//         </div>
//         <div className="flex gap-[20px] flex-col sm:flex-row items-center">
//           <div className="flex items-center relative">
//             <button 
//               className="text-[#000] gap-[12px] flex items-center"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             >
//               <img
//                 src={image || defaultImage}
//                 alt=""
//                 className="rounded-full w-[38px] h-[38px]"
//               />
//               <div className="text-left text-[14px]">
//                 <h1 className="font-medium">
//                   {localStorage.getItem("managerRole")}
//                 </h1>
//                 <p>{localStorage.getItem("userFName")}</p>
//               </div>
//               <FaChevronDown className={`text-[22px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {/* Dropdown Menu */}
//             {isDropdownOpen && (
//               <div className="absolute right-[-4px] top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//                 <ul>
//                   <li 
//                     className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
//                     onClick={() => handleOptionClick('changeProfile')}
//                   >
//                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//                       <img
//                         src={fallbackImage}
//                         alt=""
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     </div>
//                     <span className="text-gray-700 hover:text-[#269F8B]">Change Profile Image</span>
//                   </li>
                  
//                   <li 
//                     className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
//                     onClick={() => handleOptionClick('changePassword')}
//                   >
//                     <Lock className="w-5 h-5 text-gray-600" />
//                     <span className="text-gray-700 hover:text-[#269F8B]">Change Password</span>
//                   </li>
                  
//                   <li 
//                     className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
//                     onClick={() => handleOptionClick('settings')}
//                   >
//                     <Settings className="w-5 h-5 text-gray-600" />
//                     <span className="text-gray-700 hover:text-[#269F8B]">Profile Settings</span>
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
          
//           <div className="flex flex-row items-center gap-[25px]">
//             <div className="relative">
//               <FaBell className="text-[25px]" />
//               <div className="text-[#fff] absolute text-[14px] font-medium text-center rounded-full bg-themeGreen -top-2 -right-2 w-[20px] h-[20px] ">
//                 0
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="w-[104px] h-[36px] items-center justify-center bg-themeGreen flex gap-[10px] rounded-[8px]"
//             >
//               <LogOut className="w-[15px] h-[15px]" />
//               <span className="font-[500] text-[12px]">Log out</span>
//             </button>
//           </div>
//         </div>
//       </nav>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//       />
//     </>
//   );
// };

// export default Navbar;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Lock, Settings } from "lucide-react";
import { FaChevronDown, FaBell } from "react-icons/fa";
import img from "../../public/images/image.jpg";
import { toast, ToastContainer } from "react-toastify";
import fallbackImage from "/public/images/dashboard_img3.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState();
  const [image, setImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const defaultImage = fallbackImage;

  useEffect(() => {
    const storedImage = localStorage.getItem("SalesAgent_Image") || localStorage.getItem("Teamleader_Image");
    if (storedImage) {
      try {
        const imagePath = JSON.parse(storedImage);
        setImage(imagePath);
      } catch (error) {
        console.error("Error parsing image path:", error);
        setImage(defaultImage);
      }
    } else {
      setImage(defaultImage);
    }
  }, []);

  useEffect(() => {
    const images = localStorage.getItem("managerImage");
    if (images == "null") {
      setProfilePic(img);
      return;
    } else {
      setProfilePic(images);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successfully");
    navigate("/"); // Navigate to login page
  };

  const handleOptionClick = (action) => {
    setIsDropdownOpen(false);
    switch(action) {
      case 'changeProfile':
        break;
      case 'changePassword':
        break;
      case 'settings':
        break;
      default:
        break;
    }
  };

  return (
    <>
      <nav className="flex md:flex-row flex-col items-center justify-between py-[20px] px-[30px]">
        <div>
          <img src="/images/logo.png" alt="" className="w-[197px] h-[40px] ml-[-20px]" />
        </div>
        <div className="flex gap-[20px] flex-col sm:flex-row items-center">
          <div className="flex items-center relative">
            <button 
              className="text-[#000] gap-[12px] flex items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={image || defaultImage}
                alt=""
                className="rounded-full w-[38px] h-[38px]"
              />
              <div className="text-left text-[14px]">
                <h1 className="font-medium">
                  {localStorage.getItem("managerRole")}
                </h1>
                <p>{localStorage.getItem("userFName")}</p>
              </div>
              <FaChevronDown className={`text-[22px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-[-4px] top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <ul>
                  <li 
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                    onClick={() => handleOptionClick('changeProfile')}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <img
                        src={image || defaultImage}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <span className="text-gray-700 hover:text-[#269F8B]">Change Profile Image</span>
                  </li>
                  
                  <li 
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                    onClick={() => handleOptionClick('changePassword')}
                  >
                    <Lock className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 hover:text-[#269F8B]">Change Password</span>
                  </li>
                  
                  <li 
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                    onClick={() => handleOptionClick('settings')}
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 hover:text-[#269F8B]">Profile Settings</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex flex-row items-center gap-[25px]">
            <div className="relative">
              <FaBell className="text-[25px]" />
              <div className="text-[#fff] absolute text-[14px] font-medium text-center rounded-full bg-themeGreen -top-2 -right-2 w-[20px] h-[20px] ">
                0
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-[104px] h-[36px] items-center justify-center bg-themeGreen flex gap-[10px] rounded-[8px]"
            >
              <LogOut className="w-[15px] h-[15px]" />
              <span className="font-[500] text-[12px]">Log out</span>
            </button>
          </div>
        </div>
      </nav>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
};

export default Navbar;
