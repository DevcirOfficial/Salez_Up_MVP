import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaArrowUp } from "react-icons/fa";
import Agent_Ranking_chart from "./Agent_Ranking_chart";
import noImage from '/images/image.jpg'
import Actual_Vs_Target_logic from "./testing/Actual_Vs_Target_logic";
import Forecast_Commission_logic from "./testing/Forecast_Commission_logic";

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

const RevenueTable = ( barIndex ) => {
  const [agents, setAgents] = useState([]);
  const [mainAgent, setMainAgent] = useState({})

  const [currency, setCurrency] = useState('')
  const [aggregatedData, setAggregatedData] = useState(JSON.parse(localStorage.getItem('aggregated data')));
  const [agentPerformance, setAgentPerformance] = useState(JSON.parse(localStorage.getItem('tableData1')))
  const [forecastSummary, setForecastSummary] = useState();

  const [forcastPercent,setForcastPercent]=useState();

  const [leaderboardData, setLeaderboardData] = useState([]);


  useEffect(() => {
    const fetchAgents = async () => {
      const response = await fetch(`https://crmapi.devcir.co/api/sales_agents/team/${localStorage.getItem('Team_id')}`);
      const data = await response.json();
      const agentActualValue = agentPerformance.slice(0).reduce(
        (total, data) => total + parseFloat(data.values[1] || 0),
        0
      ).toFixed(1)

      const formattedAgents = data.map((agent, index) => {
        const kpiData = JSON.parse(agent.kpi_data);
        const target = kpiData.kpiData[barIndex.barIndex].target;
        const commissionValue = kpiData.kpiData[barIndex.barIndex].opportunity;
        console.log("Actual Value:  ", aggregatedData?.[index]?.aggregatedValues[barIndex.barIndex])
        const actualValue = aggregatedData?.[index]?.aggregatedValues[barIndex.barIndex] || 1;  
        console.log("asdqewqrt:  ", aggregatedData?.[index]?.aggregatedValues[barIndex.barIndex])
        const targetPercentage = (actualValue / target) * 100;

        console.log("Target Value:  ", target)

        return {
          id: agent.id,
          name: `${agent.first_name} ${agent.last_name}`,
          targetPercentage,
          rank: 0,
          score: target,
          target: target,
          actual: actualValue,
          commission: commissionValue,
          image: agent.image_path,
        };
      });

      setLeaderboardData(formattedAgents)
      console.log("AGents   : ", formattedAgents)

      const sortedAgents = formattedAgents.sort((a, b) => b.targetPercentage - a.targetPercentage);
      const topAgents = [];
      let currentRank = 1;

      for (let i = 0; i < sortedAgents.length; i++) {
        if (i > 0 && sortedAgents[i].targetPercentage === sortedAgents[i - 1].targetPercentage) {
          // If the current agent has the same targetPercentage as the previous one, assign the same rank
          topAgents.push({
            ...sortedAgents[i],
            rank: topAgents[topAgents.length - 1].rank,
            target: `${sortedAgents[i].targetPercentage.toFixed(2)}%`,
          });
        } else {
          // Assign a new rank
          topAgents.push({
            ...sortedAgents[i],
            rank: currentRank,
            target: `${sortedAgents[i].targetPercentage.toFixed(2)}%`,
          });
          currentRank++;
        }
      }

      setAgents(topAgents);

      const agentId = localStorage.getItem('id');
      const foundAgent = formattedAgents.find(agent => agent.id == agentId);
      if (foundAgent) {
        setMainAgent([foundAgent]);
        console.log("Main Agent= ", foundAgent)
      }
    };
    const summaryData = JSON.parse(localStorage.getItem('forecast_commission'))
    setForecastSummary(summaryData)
    fetchAgents();
  }, [aggregatedData]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key == 'tableData1' || 'aggregated data') {
        setAgentPerformance(JSON.parse(localStorage.getItem('tableData1')))
        setAggregatedData(JSON.parse(localStorage.getItem('aggregated data')))
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const [forcast,setForcast] = useState('');
  const [forcast_Percentage,setForcast_Percentage] =useState('')

  useEffect(()=>{

    const forcastData=localStorage.getItem('commission_salesagent')
    setForcast(forcastData);   
    console.log('Forcast Data 2: ',forcastData);

   const forcast_percentage2 = localStorage.getItem('forcast_percentage');
   console.log("value of forcast percentage: ",forcast_percentage2);

   setForcast_Percentage(forcast_percentage2)

   localStorage.setItem('Percent_to_forcast',forcast_Percentage)

  },[])

  useEffect(()=>{
    const forcast_percentage2 = localStorage.getItem('forcast_percentage');
  
    console.log("value of forcast percentage: ",forcast_percentage2);

   setForcast_Percentage(forcast_percentage2)


  },[forcast_Percentage])

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full flex flex-row justify-between space-x-7">
        <div className="w-[50%] rounded-3xl shadow p-6 max-w-4xl mx-auto border-[1px] border-gray-200">
          <div className="flex justify-between items-center mb-10">
            <div className="text-2xl flex items-center">
              <img
                src="/images/BeaufortGreen.png"
                alt="image"
                className="w-8 h-8 mr-2 rounded-full"
              />
              <p className="text-[#009245]">BEAUFORT GREEN</p>
            </div>
            <div className="text-[12px] text-[#009245]">
              Negotiator Leaderboard
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
              <h2 className="text-xl font-bold text-green-600">£{isNaN((forcast_Percentage / 100) * mainAgent[0]?.commission) ? 0 : ((forcast_Percentage / 100) * mainAgent[0]?.commission).toFixed(1)}</h2>
            </div>
            <div className="flex items-center text-[#009245] font-medium">
              <FaArrowUp className="mr-1" />
              <span>0%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <h3 className="font-medium text-gray-800">Actual vs Target</h3>
              <p className="text-xs text-green-600 mb-4">^ {(mainAgent[0]?.actual / mainAgent[0]?.target * 100).toFixed(1)}% to target</p>
              <div className="relative flex justify-center mr-6 items-center -mt-9">
                <HalfDonutChart
                  data={[
                    Math.min((mainAgent[0]?.actual / mainAgent[0]?.target * 100), 100),
                    Math.max(0, 100 - (mainAgent[0]?.actual / mainAgent[0]?.target * 100))
                  ]}
                  colors={["#ff5f66", "#f3f4f6"]}
                />
                <div className="absolute inset-3 w-full flex mt-16 flex-col justify-evenly items-center">
                  <p className="text-red-500 text-2xl font-normal">{currency}{(mainAgent[0]?.actual < 1000 ? mainAgent[0]?.actual : (isNaN(parseFloat(mainAgent[0]?.actual / 1000)) ? 0 : parseFloat(mainAgent[0]?.actual / 1000).toFixed(1)))}{mainAgent[0]?.actual < 1000 ? '' : 'K'}</p>
                  <div className="flex justify-between text-sm text-gray-500 w-full">
                    <span>{currency}0{mainAgent[0]?.target < 1000 ? '' : 'K'}</span>
                    <span>{currency}{mainAgent[0]?.target < 1000 ? mainAgent[0]?.target : parseInt(mainAgent[0]?.target / 1000)}{mainAgent[0]?.target < 1000 ? '' : 'K'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-px bg-gray-300 h-40 mx-7"></div>

            <div className="flex-1 flex flex-col justify-center items-center text-center ">
         
              <Forecast_Commission_logic barIndex = {barIndex.barIndex}/>
            </div>


          </div>
        </div>
      </div>

      <Agent_Ranking_chart leaderboardData={leaderboardData} />
      <Actual_Vs_Target_logic barIndex={barIndex.barIndex}/>
    </div>
  );
};

export default RevenueTable;