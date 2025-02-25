import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaArrowUp } from "react-icons/fa";
import Agent_Ranking_chart from "./Agent_Ranking_chart";
import noImage from '/images/image.jpg'
import Actual_Vs_Target_logic_teamleader from "./testing/Actual_Vs_Target_logic_teamleader";
import Forecast_Commission_logic_TeamLeader from "./testing/Forecast_Commission_logic_TeamLeader";

ChartJS.register(ArcElement, Tooltip, Legend);

const HalfDonutChart = ({ data, colors }) => {
    const options = {
        rotation: -90,
        circumference: 180,
        cutout: "92%",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
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
        <div style={{ width: "150px", height: "150px", marginLeft: "18%" }}>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

const RevenueTable_TeamLeader = ( barIndex ) => {
    const [agents, setAgents] = useState([]);
    const [mainAgent, setMainAgent] = useState({})

    const [currency, setCurrency] = useState('$')
    const [aggregatedData, setAggregatedData] = useState(JSON.parse(localStorage.getItem('aggregated data')));
    const [allAgentsPerformance, setAllAgensPerformance] = useState(JSON.parse(localStorage.getItem('TeamLeader Actual')));
    const [agentPerformance, setAgentPerformance] = useState(JSON.parse(localStorage.getItem('tableData1')))
    const [agentsTarget, setAgentsTarget] = useState(localStorage.getItem('TotalTargetAgents')?.split(',') || []);
    const [forecastSummary, setForecastSummary] = useState();

    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        console.log("INDEX FOR BAR: ", barIndex.barIndex)
        const fetchAgents = async () => {
            const id = localStorage.getItem("TeamId");
            const response = await fetch(`https://crmapi.devcir.co/api/sales_agents/team/${id}`);
            const data = await response.json();
            const agentActualValue = agentPerformance.slice(0).reduce(
                (total, data) => total + parseFloat(data.values[barIndex.barIndex] || 0),
                0
            ).toFixed(1)

            console.log("AGG VALUE", aggregatedData)

            const formattedAgents = data.map((agent, index) => {
                const kpiData = JSON.parse(agent.kpi_data);
                console.log("Target: ", kpiData.kpiData[barIndex.barIndex].target)
                const target = kpiData.kpiData[barIndex.barIndex].target;
                const actualValue =
                    // `${agent.first_name} ${agent.last_name}` == "Taylor Swift"
                    //   ? parseFloat(agentActualValue)
                    //   : 
                    aggregatedData[index]?.aggregatedValuesTeamLeader[barIndex.barIndex] || 1;


                const targetPercentage = (actualValue / target) * 100;

                return {
                    id: agent.id,
                    name: `${agent.first_name} ${agent.last_name}`,
                    targetPercentage,
                    rank: 0,
                    score: target,
                    target: target,
                    actual: actualValue,
                    image: agent.image_path,
                };
            });

            setLeaderboardData(formattedAgents)
            console.log("AGents   : ", formattedAgents)

            const topAgents = formattedAgents
                .sort((a, b) => b.targetPercentage - a.targetPercentage)
                .slice(0, 3)
                .map((agent, index) => ({
                    ...agent,
                    rank: index + 1,
                    target: `${agent.targetPercentage.toFixed(2)}%`,
                }));

            setAgents(topAgents);

            const agentId = localStorage.getItem('id');
            const foundAgent = formattedAgents.find(agent => agent.id == agentId);
            if (foundAgent) {
                setMainAgent([foundAgent]);
            }
        };
        const summaryData = JSON.parse(localStorage.getItem('forecast_commission'))
        setForecastSummary(summaryData)
        fetchAgents();
    }, [aggregatedData]);


    const [forcast, setForcast] = useState('');
    const [forcast_Percentage, setForcast_Percentage] = useState('')

    useEffect(() => {
        const forcast_percentage2 = localStorage.getItem('forcast_percentage');
        console.log("value of forcast percentage: ", (forcast_percentage2));

        setForcast_Percentage(forcast_percentage2)

        localStorage.setItem('Percent_to_forcast', forcast_Percentage)

    }, [])

    useEffect(() => {
        
        const forcastData = (JSON.parse(localStorage.getItem('Agents_KPI_Data')))

        console.log("FORCAST DATA", forcastData.opportunity)
        
        setForcast(parseFloat(forcastData.opportunity));
        
        // console.log('Forcast Data 2:',forcastData);

        const forcast_percentage2 = localStorage.getItem('forcast_percentage');

        console.log("value of forcast percentage: ", forcast_percentage2);

        setForcast_Percentage(forcast_percentage2)


    }, [forcast_Percentage])


    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'aggregated data' || 'TeamLeader Actual') {
                setAggregatedData(JSON.parse(localStorage.getItem('aggregated data')))
                setAllAgensPerformance(JSON.parse(localStorage.getItem('TeamLeader Actual')))
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    return (
        <div className="w-full flex flex-col space-y-4">
            <div className="w-full flex flex-row justify-between space-x-7">
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
                    <div className="flex justify-around space-x-4">
                        {agents.map((agent, index) => (
                            <div key={index} className="text-center">
                                <div className="relative">
                                    <img
                                        className="w-20 h-20 rounded-full mx-auto"
                                        src={agent.image || noImage}
                                        alt={agent.name}
                                    />
                                    <div className="absolute -bottom-2 right-1 w-7 h-7 rounded-full">
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
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <p className="text-lg text-[#009245]">Forecast Commission</p>
                            <h2 className="text-xl font-bold text-green-600">${((forcast_Percentage / 100) * forcast).toFixed(1)}</h2>
                        </div>
                        <div className="flex items-center text-[#009245] font-medium">
                            <FaArrowUp className="mr-1" />
                            <span>0%</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                            <h3 className="font-medium text-gray-800">Actual vs Target</h3>
                            <p className="text-xs text-green-600 mb-4">^ {(allAgentsPerformance[0]?.aggregatedValues[barIndex.barIndex] / agentsTarget[barIndex.barIndex] * 100).toFixed(1)}% to target</p>
                            <div className="relative flex justify-center mr-6 items-center -mt-9">
                                <HalfDonutChart
                                    data={[ 
                                        Math.min((allAgentsPerformance[0]?.aggregatedValues[barIndex.barIndex] / agentsTarget[barIndex.barIndex] * 100), 100),
                                        Math.max(0, 100 - (allAgentsPerformance[0]?.aggregatedValues[barIndex.barIndex] / agentsTarget[barIndex.barIndex] * 100))
                                    ]}
                                    colors={["#ff5f66", "#f3f4f6"]}
                                />
                                
                                <div className="absolute inset-3 w-full flex mt-16 flex-col justify-evenly items-center">
                                    <p className="text-red-500 text-2xl font-normal">
                                        {allAgentsPerformance[0]?.aggregatedValues[barIndex.barIndex] < 1000 
                                            ? `${currency}${allAgentsPerformance[0]?.aggregatedValues[barIndex.barIndex].toFixed(1)}` 
                                            : `${currency}${(allAgentsPerformance[0]?.aggregatedValues[barIndex.barIndex] / 1000).toFixed(1)}K`}
                                    </p>
                                    <div className="flex justify-between text-sm text-gray-500 w-full">
                                        <span>{currency}0K</span>
                                        <span>
                                            {agentsTarget[barIndex.barIndex] < 1000 
                                                ? `${currency}${agentsTarget[barIndex.barIndex]}` 
                                                : `${currency}${parseInt(agentsTarget[barIndex.barIndex] / 1000)}K`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-px bg-gray-300 h-40 mx-7"></div>

                        <div className="flex-1 flex flex-col justify-center items-center text-center ">

                            <Forecast_Commission_logic_TeamLeader barIndex={barIndex.barIndex} />
                        </div>


                    </div>
                </div>
            </div>

            <Agent_Ranking_chart leaderboardData={leaderboardData} />
            <Actual_Vs_Target_logic_teamleader  barIndex={barIndex.barIndex} />
        </div>
    );
};

export default RevenueTable_TeamLeader;