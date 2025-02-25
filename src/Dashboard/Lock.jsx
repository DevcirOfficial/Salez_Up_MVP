import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";

const CommissionCard = () => {
  // Hardcoded values
  const DEFAULT_COMMISSION = 200; // Commission value
  const DEFAULT_PERCENTAGE = 50; // Fixed percentage for progress bar

  // States
  const [b, setB] = useState(32); // Value B
  const [a, setA] = useState(64); // Value A
  const [isLocked, setIsLocked] = useState(true); // Lock state
  const [showUnlockIcon, setShowUnlockIcon] = useState(false); // Show unlock icon state

  useEffect(() => {
    if (b > a) {
      setIsLocked(false); // Unlock
      setShowUnlockIcon(true); // Show unlock icon
      // Remove unlock icon after 3 seconds
      const timer = setTimeout(() => {
        setShowUnlockIcon(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsLocked(true); // Lock
    }
  }, [b, a]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative">
      {/* Card Container */}
      <div
        className={`relative w-40 h-60 bg-white shadow-md rounded-md flex flex-col justify-center items-center z-10 transition ${
          isLocked ? "bg-opacity-50 backdrop-blur-sm" : ""
        }`}
      >
        {/* Black Transparent Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md z-20"></div>
        )}

        <p className="text-green-600 font-medium z-10">Commission</p>
        <p className="text-green-600 text-lg font-semibold z-10">
          ${DEFAULT_COMMISSION}
        </p>
        <div className="relative w-20 h-20 mt-4 z-10">
          {/* Circular Progress Bar */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              strokeWidth="8"
              className="text-gray-300"
              fill="none"
              stroke="currentColor"
            />
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              strokeWidth="8"
              className="text-green-600"
              fill="none"
              stroke="currentColor"
              strokeDasharray="251.2"
              strokeDashoffset={(251.2 * (100 - DEFAULT_PERCENTAGE)) / 100} // Fixed 50% progress
            />
          </svg>
          {/* Fixed Percentage in the center */}
          <p className="absolute inset-0 flex justify-center items-center text-green-600 text-lg font-semibold">
            {DEFAULT_PERCENTAGE}%
          </p>
        </div>

        {/* Lock/Unlock Icon */}
        {isLocked ? (
          <div className="absolute inset-0 flex justify-center items-center z-30">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex justify-center items-center">
              <FontAwesomeIcon icon={faLock} className="text-white w-10 h-10" />
            </div>
          </div>
        ) : (
          showUnlockIcon && (
            <div className="absolute inset-0 flex justify-center items-center z-30">
              <div className="w-20 h-20 bg-green-600 rounded-full flex justify-center items-center transform scale-100 transition-transform duration-500 ease-in-out">
                <FontAwesomeIcon
                  icon={faLockOpen}
                  className="text-white w-4 h-4 scale-300 transition-transform duration-500"
                  style={{ transform: "scale(3)" }}
                />
              </div>
            </div>
          )
        )}
      </div>

      {/* Controls to update values */}
      <div className="flex flex-col ml-8 z-10">
        <div className="mb-2">
          <label className="mr-2 text-gray-600">Value B:</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(parseInt(e.target.value) || 0)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="mr-2 text-gray-600">Value A:</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(parseInt(e.target.value) || 0)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default CommissionCard;



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 

// import react, { useEffect } from 'react';

// export default function CommissionCard(){

//     useEffect(()=>{

// console.log("Wad")

// const gatekeeper=localStorage.getItem('')

//     },[])

//     return(
//         <>
        
        
        
        
        
        
        
        
        
        
//         </>
//     )
// }


