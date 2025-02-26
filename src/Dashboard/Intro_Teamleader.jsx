// import React, { useState, useEffect } from "react";
// import axios from 'axios';

// const Intro_Teamleader = () => {
//   const loggedInLeaderName = localStorage.getItem("userFName");
//   const [leaderImage, setLeaderImage] = useState(null);
//   const [teamId, setTeamId] = useState()
//   const [teamLeaderData, setTeamLeaderData] = useState(null);
//   const [teamData, setTeamData] = useState(null);
//   const [aggregatedKPIData, setAggregatedKPIData] = useState([]);
//   const [allKpiData, setAllKpiData] = useState([]);
//   const [summedKPIData, setSummedKPIData] = useState([]);
//   const [totalKPIDataSum, setTotalKPIDataSum] = useState(0);

//   useEffect(() => {
//     const storedImage = localStorage.getItem("Teamleader_Image");
//     if (storedImage && storedImage !== "null") {
//       try {
//         const imagePath = JSON.parse(storedImage);
//         setLeaderImage(imagePath);
//       } catch (error) {
//         console.error("Error parsing image path:", error);
//         setLeaderImage(null);
//       }
//     }

//     const fetchTeamLeaderData = async () => {
//       const team_id = localStorage.getItem("id")
//       setTeamId(team_id)
//       try {
//         const response = await axios.get(`https://crmapi.devcir.co/api/team_leaders/${team_id}`);
//         setTeamLeaderData(response.data);
//       } catch (error) {
//         console.error("Error fetching team leader data:", error);
//       }
//     };

//     const fetchTeamData = async () => {
//       try {
//         const response = await axios.get(`https://crmapi.devcir.co/api/sales_agents/team/37`);
//         const fetchedData = response.data.map(member => {
//           const kpiData = JSON.parse(member.kpi_data);
//           return {
//             name: `${member.first_name} ${member.last_name}`,
//             role: "Sales Agent",
//             image: member.image_path || "/public/images/image_not_1.jfif",
//             kpi_data: JSON.parse(member.kpi_data)
//           };
//         });

//         // Aggregate KPI data for each agent
//         const allKPIData = fetchedData.map(agent => agent.kpi_data.kpiData.map(kpi => kpi.opportunity));
//         setAggregatedKPIData(allKPIData);

//         const allTargetData = fetchedData.map(agent => agent.kpi_data.kpiData.map(kpi => kpi.target));
//         const summedTargetData = allTargetData.reduce((acc, curr) => {
//           curr.forEach((value, index) => {
//             acc[index] = (acc[index] || 0) + parseFloat(value);
//           });
//           return acc;
//         }, []);
//         localStorage.setItem("TotalTargetAgents", summedTargetData)

//         // Set all KPI data in the new state
//         const structuredKPIData = fetchedData.map(agent => agent.kpi_data.kpiData);
//         setAllKpiData(structuredKPIData);

//         // Sum all data for each array in allKPIData
//         const summedData = allKPIData.map(agentKPI => 
//           agentKPI.reduce((acc, value) => acc + value, 0)
//         );
//         setSummedKPIData(summedData);

//         // Sum all values of summedKPIData
//         const totalSum = summedData.reduce((acc, value) => acc + value, 0);
//         setTotalKPIDataSum(totalSum);

//         localStorage.setItem("Commission Data", totalSum)

//         console.log("TOTAL KPI DATA SUM: ", summedTargetData);

//         setTeamData({
//           leader: {
//             name: localStorage.getItem("userFName"),
//             role: "TEAM LEADER",
//             image: leaderImage || "/public/images/image_not_1.jfif",
//           },
//           stats: {
//             teamSize: `${fetchedData.length} FTE`,
//             campaigns: "2"
//           },
//           team: fetchedData
//         });
//       } catch (error) {
//         console.error("Error fetching team data:", error);
//       }
//     };

//     fetchTeamLeaderData();
//     fetchTeamData();
//   }, []);

//   const handleImageError = (e) => {
//     e.target.src = "/public/images/image_not_1.jfif";
//   };

//   return (
//     <div className='w-auto mt-8 p-4 flex flex-col gap-[32px] mb-4'>
//       <div className="flex flex-col w-auto gap-6 p-8 pb-12 card">
//         <div className="flex justify-between mb-8">
//           <h2 className="text-xl font-medium text-emerald-500">My Team</h2>
//           <div className="space-y-1">
//             <p className="text-lg text-themeGreen">Team Size : <span className="text-gray-800">  {teamData?.stats.teamSize} </span>  </p>
//             <p className="text-lg text-themeGreen">Campaigns : {teamData?.stats.campaigns}</p>
//           </div>
//         </div>

//         {/* Team Leader Section */}
//         <div className="flex flex-col items-center mb-12">
//           <div className="relative mb-2">
//             <img
//               src={teamData?.leader.image}
//               alt={teamData?.leader.name}
//               className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
//               onError={handleImageError}
//             />
//           </div>
//           <p className="text-red-500 font-medium">{teamData?.leader.role}</p>
//           <p className="text-gray-700">{teamData?.leader.name}</p>
          
//           {/* Vertical Line */}
//           <div className="h-24 w-[1px] bg-[#20B2AA] my-4"></div>
//         </div>

//         {/* Team Members Grid */}
//         <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
//           {teamData?.team.map((member, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div className="relative mb-2">
//                 <img
//                   src={member.image}
//                   alt={member.name}
//                   className="w-16 h-16 rounded-full border-2 border-red-500"
//                   onError={handleImageError}
//                 />
//               </div>
//               <p className="text-red-500 text-sm text-center">{member.role}</p>
//               <p className="text-gray-700 text-sm text-center">{member.name}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Intro_Teamleader;

import React, { useState, useEffect } from "react";
import axios from 'axios';
import fallbackImage from "/public/images/image_not_1.jfif";
import Coke from "/public/images/coke.png";


const Intro_Teamleader = () => {
  const loggedInLeaderName = localStorage.getItem("userFName");
  const [leaderImage, setLeaderImage] = useState(null);
  const [teamId, setTeamId] = useState()
  const [teamLeaderData, setTeamLeaderData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [aggregatedKPIData, setAggregatedKPIData] = useState([]);
  const [allKpiData, setAllKpiData] = useState([]);
  const [summedKPIData, setSummedKPIData] = useState([]);
  const [totalKPIDataSum, setTotalKPIDataSum] = useState(0);
  const [campaignImage, setCampaignImage] = useState(null);

  const randomImages = [
    "/public/images/leader1.png",
    "/public/images/manager-terela.png",
    "/public/images/dashboard_img1.png",
    "/public/images/dashboard_img2.png",
    "/public/images/dashboard_img3.png",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("id");
      try {
        // Fetch team leader data
        const response = await axios.get(`https://crmapi.devcir.co/api/team_leaders/${id}`);
        setTeamLeaderData(response.data);
        const teamId = await JSON.parse(response.data.team_and_team_leaders[0].team_id);
        setTeamId(teamId);
        const Kpi_data = await JSON.parse(response.data.team_and_team_leaders[0].kpi_data);
        console.log("Agents_KPI_Data", Kpi_data.teamInfo);
        localStorage.setItem('Agents_KPI_Data', JSON.stringify(Kpi_data.teamInfo));
        localStorage.setItem('TeamId', teamId);

        // Fetch campaign data only if teamId is available
        if (teamId) {
          const campaignResponse = await axios.get(`https://crmapi.devcir.co/api/team_leader/by_team/${teamId}`);
          const campaignImagePath = campaignResponse.data?.team?.campaigns_and_teams?.campaign?.image_path;
          setCampaignImage(campaignImagePath || Coke);
        }

        // Fetch team data only if teamId is available
        if (teamId) {
          const teamResponse = await axios.get(`https://crmapi.devcir.co/api/sales_agents/team/${teamId}`);
          const fetchedData = teamResponse.data.map(member => {
            const kpiData = JSON.parse(member.kpi_data);
            return {
              name: `${member.first_name} ${member.last_name}`,
              role: "Sales Agent",
              image: member.image_path || randomImages[Math.floor(Math.random() * randomImages.length)],
              kpi_data: JSON.parse(member.kpi_data)
            };
          });

          const allKPIData = fetchedData.map(agent => agent.kpi_data.kpiData.map(kpi => kpi.opportunity));
          setAggregatedKPIData(allKPIData);

          const allTargetData = fetchedData.map(agent => agent.kpi_data.kpiData.map(kpi => kpi.target));
          const summedTargetData = allTargetData.reduce((acc, curr) => {
            curr.forEach((value, index) => {
              acc[index] = (acc[index] || 0) + parseFloat(value);
            });
            return acc;
          }, []);
          localStorage.setItem("TotalTargetAgents", summedTargetData);

          const structuredKPIData = fetchedData.map(agent => agent.kpi_data.kpiData);
          setAllKpiData(structuredKPIData);

          const summedData = allKPIData.map(agentKPI => 
            agentKPI.reduce((acc, value) => acc + value, 0)
          );
          setSummedKPIData(summedData);

          const totalSum = summedData.reduce((acc, value) => acc + value, 0);
          setTotalKPIDataSum(totalSum);

          localStorage.setItem("Commission Data", totalSum);

          setTeamData({
            leader: {
              name: localStorage.getItem("userFName"),
              role: "TEAM LEADER",
              image: JSON.parse(localStorage.getItem("Teamleader_Image")),
            },
            stats: {
              teamSize: `${fetchedData.length} FTE`,
              campaigns: "2"
            },
            team: fetchedData
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const handleImageError = (e) => {
  //   e.target.src = randomImages[Math.floor(Math.random() * randomImages.length)];
  // };

  return (
    <div className='w-auto mt-8 p-4 flex flex-col gap-[32px] mb-4'>
      <div className="flex flex-col w-auto gap-6 p-8 pb-12 card">
        <div className="flex justify-between mb-8">
          <h2 className="text-2xl font-medium text-themeGreen">My Team</h2>
          <div className="space-y-1">
            <p className="text-lg text-themeGreen">Team Size : <span className="text-gray-800">  {teamData?.stats.teamSize} </span>  </p>
            <div className="flex items-center gap-2">
              <p className="text-lg text-themeGreen">Campaigns : </p>
              <img 
                src={campaignImage} 
                alt="Campaign"
                className="w-8 h-8 rounded-full object-cover"
                // onError={handleImageError}
              />
            </div>
          </div>
        </div>

        {/* Team Leader Section */}
        <div className="flex flex-col items-center mt-[-60px]">
          <div className="relative mb-2">
            <img
              src={teamData?.leader.image}
              alt={teamData?.leader.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              // onError={handleImageError}
            />
          </div>
          <p className="text-red-500 font-medium">{teamData?.leader.role}</p>
          <p className="text-gray-700">{teamData?.leader.name}</p>
          
          {/* Vertical Line */}
          <div className="h-24 w-[2px] bg-[#20B2AA] my-4"></div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 md:w-[40%] md:mx-auto md:-mt-5">
          {teamData?.team.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative mb-2">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full border-2 border-red-500"
                  // onError={handleImageError}
                />
              </div>
              <p className="text-red-500 text-sm text-center">{member.role}</p>
              <p className="text-gray-700 text-sm text-center">{member.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Intro_Teamleader;