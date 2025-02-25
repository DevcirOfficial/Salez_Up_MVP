import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import logo from './salez_up_logo.jpg'

export default function Login({ setIsAuthenticated }) {
    const [formData, setFormData] = useState({
        id: 0,
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('https://crmapi.devcir.co/api/admin_portal_login');
            const userDataList = response.data; 
            const userData = userDataList.find(user => user.admin_email == formData.email);
            if (!userData) {
                toast.error('Invalid email or password');
                return;
            }
            const decryptedBytes = CryptoJS.AES.decrypt(userData.admin_password, 'DBBDRSSR54321');
            const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);
            formData.id = userData.id;
            if (decryptedPassword == formData.password) {

                toast.success('Login successful!');
                // login(); 
                localStorage.setItem('userData', JSON.stringify(formData));

                setTimeout(() => navigate('/admin_portal_dashboard'), 2000);

            } else {
                toast.error('Invalid email or password');
            }
        } catch (error) {
            toast.error('Error occurred while logging in');
            console.error('API request error:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState); 
    };
    return (
        <>
            <ToastContainer />
            <div className="relative overflow-hidden bg-gray-50">
                <div className="absolute top-20 left-2 w-[500px] h-[500px] bg-[#4cc7b2] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob"></div>
                <div className="absolute top-20 right-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-2000"></div>
                <div className="hidden xl:block absolute bottom-10 left-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-10 right-52 w-[500px] h-[500px] bg-[#CAEEF580] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-4000"></div>
                <div className="flex flex-col justify-center min-h-full py-20 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md ">
                    <img 
    className="w-auto h-12 mx-auto" 
    src={logo} 
    alt="Your Company" 
/>
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-[#279f8b]">Sign in to your account</h2>
                    </div>
                    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="px-4 py-16 mb-4 bg-white shadow sm:rounded-lg sm:px-10 ">
                            <form className="space-y-12 " onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#279f8b]">Email address</label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-[#279f8b]">Password</label>
                                    <div className="relative mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                        <div onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer">
                                            {showPassword ? <RxEyeOpen className="text-xl text-gray-500" /> : <RxEyeClosed className="text-xl text-gray-500" />}
                                        </div>
                                    </div>
                                </div>
                                <div className='pt-4'>
                                    <button
                                        type="submit"
                                        className="flex justify-center w-full px-2.5 py-2 mt-4 text-sm font-medium text-white bg-[#279f8b] border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:transition-all hover:duration-300 hover:scale-110 hover:cursor-pointer focus:ring-offset-2"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}