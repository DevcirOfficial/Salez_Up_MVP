import React, { useState } from "react";
import 'react-circular-progressbar/dist/styles.css';
import pointer from '/images/pointer.png'
import noImage from '/images/image.jpg'

const Agent_Ranking_chart = ({ leaderboardData }) => {
    const [activeButton, setActiveButton] = useState("Month");
    const buttons = ["Day", "Week", "Month", "Year"];

    const Badge = ({ rank }) => {
        const images = {
            1: '/images/1stprizes.png',
            2: '/images/2prize.png',
            3: '/images/3prize.png',
        };

        return (
            <>
                {rank <= 3 && (
                    <div className="absolute -top-1  w-8 h-8 rounded-full">
                        <img
                            src={images[rank]}
                            alt={`Rank ${rank}`}
                            className="w-full h-[40px] object-cover"
                        />
                    </div>
                )}
            </>
        );
    };

    // Custom Progress Bar Component
    const CustomProgressBar = ({ completed, total }) => {
        const percentage = (completed / total) * 100;

        return (
            <div className="relative h-3 w-[100%] bg-[#C6E5D5] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full max-w-[100%]"
                    style={{
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, #1A7465 30%, #2DDAB9 70%)',
                        transition: 'width 0.3s ease-in-out'
                    }}
                />
                <div
                    className="absolute font-bold bg-white text-[#009245] w-16 text-xs rounded px-4 py-1"
                    style={{
                        top: '-6px',
                        left: `calc(${Math.min(completed / total * 100, 100)}% - ${Math.min(completed / total * 100, 100) >= 100 ? 60 : 10}px)`,
                        zIndex: 10,
                    }}
                >
                    {completed < 1000 ? completed : `${parseFloat(completed / 1000).toFixed(2)}K`}
                </div>
            </div>
        );
    };

    const LeaderboardItem = ({ rank, name, score, image, actual, badgess }) => (
        <div className="flex items-center mb-4 w-full">
            <div className="relative w-10 text-center ">
                <Badge rank={rank} />
                <div className={`w-10 text-center text-lg font-semibold ${rank <= 3 ? 'invisible' : 'text-[#327D71]'}`}>
                    {rank}
                </div>
            </div>

            <div className="relative w-16 h-16 rounded-full">
                <img
                    src={image || Coke}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="text-sm font-semibold ml-4 w-32 truncate text-[#009245]">{name}</div>
            <div className="flex-grow mx-4 relative">
                <div className="relative">
                    <CustomProgressBar completed={actual} total={score} />
                </div>
            </div>

            <div className="relative w-10 h-10 rounded-full">
                <img
                    src={pointer}
                    alt={"pointer"}
                    className="w-full h-full object-cover"
                />
            </div>
            <p className="ml-2 text-[#009245]">
                {score < 1000 ? score : parseFloat(score / 1000).toFixed(2)}{score < 1000 ? '' : 'K'}
            </p>
        </div>
    );

    const Leaderboard = ({ leaderboardData }) => (
        <div className="rounded-3xl border-[1px] border-gray-200 shadow py-8 mt-4 w-full max-w-10xl">
            {/* Header Section */}
            <div className="flex items-center justify-between px-6">
                {/* Heading */}
                <h1 className=" text-xl text-[#009245]">Negotiator Ranking: Performance vs Actual</h1>

                {/* Buttons */}
                <div className="flex space-x-2 border rounded-2xl border-gray-300">
                    {buttons.map((button, index) => (
                        <button
                            key={button}
                            onClick={() => setActiveButton(button)}
                            className={`px-3 py-1 text-sm font-medium ${activeButton === button
                                ? "text-[#269F8B] shadow-xl"
                                : "text-[#ABABAB]"} ${index < buttons.length - 1 ? 'border-r' : ''}`}
                        > 
                            {button}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leaderboard Section */}
            <div className="px-6 mt-4">
                {leaderboardData.length === 0 ? (
                    <p className="text-center text-gray-500">No data available</p>
                ) : (
                    leaderboardData.map((item, index) => (
                        <LeaderboardItem
                            key={index}
                            rank={index + 1}
                            name={item.name}
                            score={item.target}
                            actual={item.actual}
                            image={item.image}
                            badgess={item.badge}
                        />
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div>
            <Leaderboard leaderboardData={leaderboardData} />
        </div>
    );
};

export default Agent_Ranking_chart;