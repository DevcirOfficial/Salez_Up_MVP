import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Edit_Admin = () => {
  const [userData, setUserData] = useState(null);
  const [decryptedPassword, setDecryptedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const email = parsedData.email;
      if (email) {
        fetchUserData(email);
      }
    }
  }, []);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`https://crmapi.devcir.co/api/admin_portal_login/email/${email}`);
      const data = await response.json();
      setUserData(data);
      setEditableData({
        admin_username: data.admin_username,
        admin_email: data.admin_email,
      });
      const decryptedBytes = CryptoJS.AES.decrypt(data.admin_password, 'DBBDRSSR54321');
      const decryptedPass = decryptedBytes.toString(CryptoJS.enc.Utf8);
      setDecryptedPassword(decryptedPass);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setDecryptedPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUpdate = async () => {
    try {
      const encryptedPassword = CryptoJS.AES.encrypt(decryptedPassword, 'DBBDRSSR54321').toString();
      
      const response = await fetch(`https://crmapi.devcir.co/api/admin_portal_login/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editableData,
          admin_password: encryptedPassword,
        }),
      });

      if (response.ok) {
        toast.success("Admin details updated successfully!");
        fetchUserData(editableData.admin_email); // Refresh data after update
      } else {
        toast.error("Failed to update admin details.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating admin details.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-8 text-2xl font-semibold text-gray-800">Admin Details</h2>
        {userData ? (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-600">Username:</label>
              <input
                type="text"
                name="admin_username"
                value={editableData.admin_username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-600">Email:</label>
              <input
                type="email"
                name="admin_email"
                readOnly
                value={editableData.admin_email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative mb-4">
              <label className="block mb-1 font-medium text-gray-600">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                value={decryptedPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-2 mt-6 mr-2.5 cursor-pointer"
              >
                {showPassword ? (
                  <RxEyeOpen className="text-xl text-gray-500" />
                ) : (
                  <RxEyeClosed className="text-xl text-gray-500" />
                )}
              </div>
            </div>
            <div className='flex items-end justify-end w-full'>
              <button
                onClick={handleUpdate}
                className="inline-block w-auto px-6 py-2 mt-4 text-center text-white transition-all bg-gray-900 rounded-md shadow-xl sm:w-auto hover:bg-gray-700 hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-2xl hover:shadow-neutral-400"
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Loading admin data...</p>
        )}
      </div>
    </div>
  );
};

export default Edit_Admin;
