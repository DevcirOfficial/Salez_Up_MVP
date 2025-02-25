import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';

const TeamLeader_Dashboard = () => {
    const [teamLeader, setTeamLeader] = useState(null);
    const [kpiData, setKpiData] = useState(null);
    const [aggregatedSums, setAggregatedSums] = useState([]);

    useEffect(() => {
        // Fetch team leader data
        fetch('https://crmapi.devcir.co/api/team_leader/by_team/37')
            .then(res => res.json())
            .then(data => {
                setTeamLeader(data.team_and_team_leader);
                setKpiData(JSON.parse(data.team_and_team_leader.kpi_data));
            })
            .catch(err => console.error(err));

        // Get and process aggregated data from localStorage
        const calculateAggregatedSums = () => {
            const aggregatedData = JSON.parse(localStorage.getItem('aggregated data')) || [];
            
            // Initialize array to store sums for each index position
            const sums = [];
            
            aggregatedData.forEach(agent => {
                const values = agent.aggregatedValues || [];
                values.forEach((value, index) => {
                    // Convert value to number and handle NaN
                    const numValue = Number(value) || 0;
                    // Initialize sum for this index if it doesn't exist
                    sums[index] = (sums[index] || 0) + numValue;
                });
            });
            
            setAggregatedSums(sums);
        };

        calculateAggregatedSums();
    }, []);

    


    const getPercentColor = (percent) => {
        if (percent >= 100) return 'bg-green-100 rounded-full';
        if (percent >= 90) return 'bg-yellow-100 rounded-full';
        return 'bg-red-100 rounded-full';
    };


    return (
        <div className='flex flex-col w-full gap-6 p-8 pb-12'>
        <Navbar />
        <div className='w-full flex flex-row'>
          <div className='w-[18%]'>
            <SideBar/>
          </div>

          <div className='flex flex-col gap-6 p-8 pb-12 card white w-[82%]'>
          <div className='flex justify-between items-center mt-10'>
                                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Campaign Performance</h1>
                                <div className='flex'>
                                    <button className='px-6 py-1 text-sm font-medium text-[#269F8B] border border-gray-300 bg-white rounded-l shadow-xl'>All</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Revenue</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Units</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Conversion</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Dials</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Productivity</button>
                                </div>
                            </div>
            <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100'>
            
              

<div className='p-6 bg-pink-200'>
  <table className='w-full'>
    <thead>
      <tr className='text-left text-sm font-medium text-gray-500'>
        <th className='pb-2 text-[#269F8B]'>KPIs</th>
        <th className='pb-2 text-[#269F8B] text-center'>Target</th>
        <th className='pb-2 text-[#269F8B] text-center'>Actual</th>
        <th className='pb-2 text-[#269F8B] text-center'>% to Target</th>
        <th className='pb-2 text-[#269F8B] text-center'>Commission</th>
        <th className='pb-2 text-[#269F8B] text-center'>Gatekeeper</th>
        <th className='pb-2 text-[#269F8B] text-center'>Gatekeeper Target</th>
      </tr>
    </thead>
    <tbody>
      {teamLeader && kpiData ? (
        kpiData.kpiData.map((kpi, index) => {
          // Calculate percentage: (actual / target) * 100
          const actual = aggregatedSums[index] || 0;
          const target = kpi.target || 1; // Prevent division by zero
          const percentage = ((actual / target) * 100).toFixed(1);

          return (
            <tr key={index} className='text-sm'>
              <td className='py-2 text-[#269F8B] font-medium'>{kpi.kpi_Name}</td>
              <td className='py-2 text-center'>{kpi.target}</td>
              <td className='py-2 text-center'>{aggregatedSums[index]?.toFixed(2)}</td>
              <td className='py-2 text-center'>
                <span className={`px-6 py-1 rounded ${getPercentColor(percentage)}`}>
                  {percentage}%
                </span>
              </td>
              <td className='py-2 text-center'>{kpiData.teamInfo.currency}{kpi.opportunity.toFixed(1)}</td>
              <td className={`py-2 text-center ${kpi.gatekeeper ? 'text-black' : 'bg-gray-100'}`}>
                {kpi.gatekeeper ? 'Yes' : 'N/A'}
              </td>
              <td className='py-2 text-center'>
                <span className={`inline-block ${!kpi.gatekeeper ? 'bg-gray-100 w-12' : ''}`}>
                  {kpi.gatekeeper || '-'}
                </span>
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="7" className="text-center py-4 text-gray-500">
            Loading KPI data...
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


            </div>
          </div>
          
        </div>
      </div>
    );
};

export default TeamLeader_Dashboard;