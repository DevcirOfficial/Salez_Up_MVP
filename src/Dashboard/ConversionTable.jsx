import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaArrowUp } from "react-icons/fa";
import Agent_Ranking_chart from "./Agent_Ranking_chart";
import Actual_Vs_Target_logic_teamleader from './testing/Actual_Vs_Target_logic_teamleader';


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const HalfDonutChart = ({ data, colors }) => {
  const options = {
    rotation: -90, // Start at the top
    circumference: 180, // Half circle (180 degrees)
    cutout: "90%", // Adjust the thickness of the donut
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
      tooltip: {
        enabled: false, // Disables tooltip
      },
    },
  };

  const chartData = {
    labels: ["Progress", "Remaining"],
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };

  return (
    <div style={{ width: "150px", height: "150px", marginLeft: "18%" }}> {/* Adjusted size */}
      <Doughnut data={chartData} options={options} />
    </div>
  );
};


const ConversionTable = () => {
  const agents = [
    {
      name: "Nava Yaghnsı",
      target: "50% to target",
      rank: 1,
      image: "/images/dashboard_img1.png",
    },
    {
      name: "Anujaa Kumar",
      target: "45% to target",
      rank: 2,
      image: "/images/dashboard_img2.png",
    },
    {
      name: "Nuraj Nujaraj",
      target: "45% to target",
      rank: 3,
      image: "/images/dashboard_img3.png",
    },
  ];

  const [leaderboardData, setLeaderboardData] = useState([
    { name: 'Charlotte King', score: 200, image: '/images/dashboard_img1.png', badge: '/images/unicorn.png' },
    { name: 'James White', score: 180, image: '/images/dashboard_img2.png', badge: '/images/platinium.png' },
    { name: 'Amelia Clark', score: 170, image: '/images/dashboard_img3.png', badge: '/images/gold.png' },
    { name: 'Ethan Lewis', score: 160, image: '/images/dashboard_img1.png', badge: '/images/silver.png' },
    { name: 'Harper Young', score: 140, image: '/images/dashboard_img2.png', badge: '/images/silver.png' },
    { name: 'Elijah Hall', score: 110, image: '/images/dashboard_img3.png', badge: '/images/bronze.png' },
    { name: 'Mila Turner', score: 90, image: '/images/dashboard_img2.png', badge: '/images/bronze.png' },
    { name: 'Logan Scott', score: 70, image: '/images/dashboard_img1.png', badge: '/images/bronze.png' },
  ]);

  const [barChartData, setBarChartData] = useState([
    { month: 'Jan', target: 10000, actual: 12000 },
    { month: 'Feb', target: 9000, actual: 9000 },
    { month: 'Mar', target: 11000, actual: 16000 },
    { month: 'Apr', target: 8000, actual: 8000 },
    { month: 'May', target: 14000, actual: 9000 },
    { month: 'Jun', target: 9000, actual: 9000 },
    { month: 'Jul', target: 15000, actual: 15000 },
    { month: 'Aug', target: 10000, actual: 10000 },
    { month: 'Sep', target: 13000, actual: 13000 },
    { month: 'Oct', target: 5000, actual: 5000 },
    { month: 'Nov', target: 11000, actual: 11000 },
    { month: 'Dec', target: 8000, actual: 8000 },
  ]);

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full flex flex-row justify-between space-x-2">
        <div className="w-[50%] rounded-3xl shadow p-6 max-w-4xl mx-auto border-[1px] border-gray-200">
          <div className="flex justify-between items-center mb-10">
            <div className="text-2xl flex items-center">
              <img
                src="/images/3campaign.png"
                alt="3 Campaign"
                className="w-8 h-8 mr-2"
              />
              <p className="text-[#009245]">BDR</p>
            </div>
            <div className="text-base text-[#009245]">
              Agent Leaderboard
            </div>
          </div>
          <div className="flex justify-around">
            {agents.map((agent, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-20 h-20 rounded-full border-4 border-gray-200 mx-auto"
                  />
                  <div className="absolute -bottom-2 right-0 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    <img
                      src={
                        agent.rank === 1
                          ? "/images/1stprizes.png"
                          : agent.rank === 2
                            ? "/images/2prize.png"
                            : "/images/3prize.png"
                      }
                      alt={`Rank ${agent.rank}`}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-[#009245] font-semibold text-[15px]">{agent.name}</h3>
                <p className="text-[#009245] text-[12px] font-semibold">{agent.target}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 w-[50%] max-w-4xl mx-auto border-[1px] border-gray-200">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-lg text-[#009245]">Forecast Commission</p>
              <h2 className="text-xl font-bold text-green-600">$210</h2>
            </div>
            <div className="flex items-center text-[#009245] font-medium">
              <FaArrowUp className="mr-1" />
              <span>3.5%</span>
            </div>
          </div>

          {/* Actual vs Target and Forecast Finish */}
          <div className="flex items-center justify-between">
            {/* Actual vs Target */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <h3 className="font-medium text-gray-800">Actual vs Target</h3>
              <p className="text-xs text-green-600 mb-4">105% to target</p>

              {/* Half-Donut Chart */}
              <div className="relative flex justify-center items-center -mt-9">
                <HalfDonutChart
                  data={[100, 0]} // Progress and remaining
                  colors={["#289780", "#f3f4f6"]} // Progress and remaining colors
                />
                <div className="absolute inset-3 w-full flex mt-16 flex-col justify-evenly items-center">
                  <p className="text-green-500 text-2xl font-light">21%</p>
                  <div className="flex justify-between text-sm text-gray-500 w-full">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>
              {/* <p className="text-sm text-red-400 mt-2">Gatekeeper</p> */}
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-300 h-40 mx-7"></div>

            {/* Forecast Finish */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <h3 className="font-medium text-gray-800">Forecast Finish</h3>
              <p className="text-xs text-green-600 mb-4">^ 105% to target</p>

              {/* Half-Donut Chart */}
              <div className="relative flex justify-center items-center -mt-9">
                <HalfDonutChart
                  data={[80, 20]} // Progress and remaining
                  colors={["#289780", "#f3f4f6"]} // Progress and remaining colors
                />
                <div className="absolute inset-3 w-full flex mt-16 flex-col justify-evenly items-center">
                  <p className="text-green-500 text-2xl font-normal">21%</p>
                  <div className="flex justify-between text-sm text-gray-500 w-full">
                    <span>0%</span>
                    <span>21%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Agent_Ranking_chart leaderboardData={leaderboardData} />
      <Actual_Vs_Target_logic_teamleader/>
    </div>
  );
};

export default ConversionTable;
