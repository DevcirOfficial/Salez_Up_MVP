import React, { useState } from 'react';
import { Pen } from 'lucide-react';
import imagee from './rk1.png';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ChevronDown, Building2, User, Lock, Eye, EyeOff } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export default function Registration() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [selectedService, setSelectedService] = useState('');

    const [period, setPeriod] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otp, setOtp] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    const [hashedPassword, setHashedPassword] = useState('');


    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };



    const navigate = useNavigate();

    const services = ['Business', 'Recruitment', 'Lab'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hash = await hashPassword(password);
        setHashedPassword(hash);
        console.log('Hashed password:', hash);

        if (!name || !email || !contact || !password || !selectedService || !period || !contactEmail) {
            toast.error('Please fill in all fields before submitting.');
            return;
        }

        // Fetch all existing user data
        try {
            const response = await fetch('https://crmapi.devcir.co/api/admin-info');
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await response.json();

            // Check if the email already exists
            const emailExists = userData.some(user => user.email == email);
            if (emailExists) {
                toast.error('Email already exists. Please use a different email.');
                return;
            }

            // If email is unique, proceed with OTP verification
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
    };






    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        try {
            // Verify OTP
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

                const hashedPassword = await hashPassword(password);
                const registrationData = {
                    name,
                    email,
                    contact,
                    password: hashedPassword,
                    selectedService,
                    period,
                    contactEmail
                };

                // Register user
                const registrationResponse = await fetch('https://crmapi.devcir.co/api/admin-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(registrationData),
                });

                if (registrationResponse.ok) {
                    const registrationResult = await registrationResponse.json();
                    console.log('Registration Successful:', registrationResult);

                    // Send email with user details
                    const sendDetailsResponse = await fetch('https://crmapi.devcir.co/api/send-user-details', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            email,
                            password,
                            businessId: registrationResult.data.business_id
                        }),
                    });

                    if (sendDetailsResponse.ok) {
                        toast.success('Registered Successfully! Check your email for login details.');
                    } else {
                        console.error('Failed to send user details email');
                        toast.warning('Registered successfully, but failed to send email with details.');
                    }

                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    console.error('Registration failed. Status:', registrationResponse.status);
                    toast.error('Registration failed. Please try again.');
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







    const renderInitialForm = () => (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AAFF7]"
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AAFF7]"
                />
            </div>
            <div>
                <input
                    type="tel"
                    placeholder="Contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AAFF7]"
                />
            </div>
            {/* <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AAFF7]"
        />
      </div> */}

            <div className="relative">
                <input
                    type={passwordVisible ? "text" : "password"} // Toggle password visibility
                    placeholder="PASSWORD"
                    className="w-full px-3 py-2 border border-gray-300 placeholder:pl-4 pl-12 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AAFF7]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute transform -translate-y-1/2 right-3 top-1/2"
                >
                    {passwordVisible ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
            </div>
            <div className="mb-4">
                <h2 className="mb-2 text-lg font-semibold">Choose a Service</h2>
                <div className="flex space-x-4">
                    {services.map((service) => (
                        <label key={service} className="flex items-center">
                            <input
                                type="radio"
                                name="service"
                                value={service}
                                checked={selectedService == service}
                                onChange={() => setSelectedService(service)}
                                className="w-4 h-4 text-[#007AAFF7] form-radio focus:ring-[#007AAFF7]"
                            />
                            <span className="ml-2 text-sm">{service}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    Period
                </label>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AAFF7]"
                >
                    <option value="" disabled>Select contract period</option>
                    <option value="Monthly Contract">Monthly Contract</option>
                    <option value="Weekly Contract">Weekly Contract</option>
                    <option value="Yearly Contract">Yearly Contract</option>
                </select>
            </div>
            <div className="mb-8">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    Contact Email Address
                </label>
                <input
                    type="email"
                    placeholder="Email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007AAFF7]"
                />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 mt-4 font-semibold text-black border-[#007AAFF7] border-2 pt-4 pb-4 bg-white rounded-md hover:bg-[#007AAFF7] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#007AAFF7] focus:ring-offset-2"
            >
                Verify Me
            </button>
        </form>
    );

    const renderOtpForm = () => (
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
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-md shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Register Now!
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Please fill in the details to create your account.
                    </p>
                </div>
                {showOtpForm ? renderOtpForm() : renderInitialForm()}
            </div>
            <ToastContainer />
        </div>
    );
}