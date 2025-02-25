import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';

const Campaigns = () => {
  const [currentCampaigns, setCurrentCampaigns] = useState([]);

  useEffect(() => {
    fetch('https://crmapi.devcir.co/api/campaigns')
      .then(response => response.json())
      .then(data => {
        const campaigns = data.map(campaign => ({
          name: campaign.team.team_name,
          img: campaign.company_logo
        }));
        setCurrentCampaigns(campaigns);
        console.log("data: ====",currentCampaigns)
      })
      .catch(error => console.error('Error fetching campaigns:', error));
  }, []);

  return (
    <>
      <Navbar />
      <div className='flex'>
        <SideBar />
        <div className='w-full mt-8 mr-5 md:ml-12'>
          <h1 className='text-[28px] leading-[42px] text-[#555555] font-[500]'>Campaigns</h1>
          <div className='flex flex-col w-full gap-10 p-5 pb-12 mt-8 card '>
            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Current Campaigns</h1>
            <div className='flex flex-wrap items-center justify-around'>
              {currentCampaigns.map((campaign, index) => (
                <div className='flex flex-col items-center gap-4' key={index}>
                  <img src={campaign.img} alt={campaign.name} className='w-[70px] h-[70px] rounded-full ' />
                  <p className='w-[124px] h-[35px] flex items-center justify-center text-[14px] leading-[25px] font-[400] rounded-[192px] bg-themeGreen text-white text-center'>{campaign.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Campaigns;