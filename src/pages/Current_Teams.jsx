import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';

const Current_Teams = () => {
  const [teams, setTeams] = useState([]);


  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('https://crmapi.devcir.co/api/teams');
        const data = await response.json();
        const activeTeams = data.filter(team => team.status == 'active'); 
        const teamNames = activeTeams.map(team => team.team_name); 
        setTeams(teamNames);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
  
    fetchTeams();
  }, []);

  return (
    <div className='mx-2'>
      <Navbar />
      <div className='flex gap-3'>
        <SideBar />
        <div className='w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4'>
          <h1 className='text-[28px] leading-[42px] text-[#555555] font-[500] -mb-6'>Teams</h1>
          <div className='flex flex-col w-full gap-6 p-8 pb-12 card'>
            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Current Teams</h1>
            <div className='flex flex-wrap items-center justify-between gap-3 lg:justify-start'>
              {teams.map((team, index) => (
                <div key={index} className=''>
                  <p className='w-[124px] h-[41px] flex items-center justify-center text-[17px] leading-[25px] font-[400] rounded-[192px] bg-themeGreen text-white text-center'>{team}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Current_Teams;