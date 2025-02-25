import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import { useResponseContext } from '../contexts/responseContext';
import Set_Contest_Individual from './Set_Contest_Individual';
import Set_Contest_Team_VS_Team from './Set_Contest_Team_VS_Team';
import Set_Contest_Head_To_Head from './Set_Contest_Head_To_Head';
import Set_Contest_Combined from './Set_Contest_Combined'; // Import your combined team component

const Current_Teams = () => {
  const contestTypes = [
    "Individual",
    "Team Vs Team",
    "Combined Team",
    "Head to Head"
  ];

  const [contestTypeSelected, setContextTypeSelected] = useState(contestTypes[0]);
  const [contestSelected, setContestSelected] = useState("MoneyMaker");

  const { shouldDisplay } = useResponseContext();

  return (
    <div className=''>
      <Navbar />
      <div className='flex gap-3'>
        <SideBar />
        <div className={`w-full mt-8 md:mr-5 md:ml-12 mx-4 pb-10 ${(shouldDisplay) ? "" : "hidden"}`}>
          <div className='flex flex-wrap items-center justify-center md:justify-start gap-[14.82px] mb-8'>
            {contestTypes.map((type, index) => (
              <div key={index} className='' onClick={() => setContextTypeSelected(type)}>
                <p className={`px-6 h-[50px] flex items-center cursor-pointer justify-center text-[20px] leading-[30px] rounded-[14.82px] ${contestTypeSelected == type ? "bg-themeGreen font-[500] text-white" : "bg-[#F8FDFC] text-dGreen font-[400]"} text-center`}>{type}</p>
              </div>
            ))}
          </div>

          {/* Conditional rendering based on contestTypeSelected */}
          {contestTypeSelected == "Individual" ? (
            <Set_Contest_Individual />
          ) : contestTypeSelected == "Team Vs Team" ? (
            <Set_Contest_Team_VS_Team />
          ) : contestTypeSelected == "Head to Head" ? (
            <Set_Contest_Head_To_Head />
          ) : contestTypeSelected == "Combined Team" ? (
            <Set_Contest_Combined /> // Add this condition for Combined Team
          ) : null}

        </div>
      </div>
    </div >
  );
};

export default Current_Teams;
