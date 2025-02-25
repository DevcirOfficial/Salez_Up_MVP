import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Add_New_Campaign from "./Add_New_Campaign";
import { useScrollContext } from "../contexts/scrollContext";
import Campaign_table from "./Campaign_table";
import fallbackImage from "/public/images/image_not_1.jfif";

const Campaigns = () => {
  const [currentCampaigns, setCurrentCampaigns] = useState([]);
  const [isCreated, setIsCreated] = useState(false);

  useEffect(() => {
    fetch("https://crmapi.devcir.co/api/campaigns_and_teams")
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.filter(
          (team) => team.campaign.manager_id == localStorage.getItem("id")
        );
        const campaigns = filtered.map((item) => ({
          name:
            item.team && item.team.team_name ? item.team.team_name : "No Team",
          img: item.campaign.image_path || fallbackImage,
        }));
        setCurrentCampaigns(campaigns);
      })
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, [isCreated]);

  const { currentCampaignRef, addNewCampaignRef } = useScrollContext();

  return (
    <>
      <Navbar />
      <div className="flex">
        <SideBar />
        <div className="w-full mt-8 mr-5 md:ml-12">
          {/* <h1 className="text-[28px] leading-[42px] text-[#555555] font-[500]">
            Campaigns
          </h1> */}
          <p className="text-[18px] leading-[42px] -mb-6">
              <span className="text-gray-400 font-medium">Dashboard/Modules/</span><span className="text-gray-600 font-semibold">Campaigns</span>
            </p>
          <div className="w-full flex-col flex gap-[32px]">
            <div
              className="flex flex-col w-full gap-10 p-5 pb-12 mt-3 card"
              id="#currentCampaigns"
              ref={currentCampaignRef}
            >
              <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">
                Current Campaigns
              </h1>

              <div className="flex flex-wrap items-center justify-around">
                {currentCampaigns.length == 0 ? (
                  <p className="text-center text-lg font-semibold text-gray-500">
                    No campaign available
                  </p>
                ) : (
                  currentCampaigns.map((campaign, index) => (
                    <div
                      className="flex flex-col items-center gap-4"
                      key={index}
                    >
                      <img
                        src={campaign.img ? campaign.img : fallbackImage}
                        className="w-[80px] h-[80px] rounded-full "
                      />
                      {/* <p className="w-[154px] h-[35px] flex items-center justify-center text-[14px] leading-[25px] font-[400] rounded-[192px] bg-themeGreen text-white text-center whitespace-nowrap overflow-hidden">
                        {campaign.name}
                      </p> */}
                      <p className="h-[35px] px-4 flex items-center justify-center text-[14px] leading-[25px] font-[400] rounded-[192px] bg-lGreen text-black text-center whitespace-nowrap overflow-hidden">
                      {campaign.name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <Campaign_table />
            {/* <Add_New_Campaign
              className="mt-60"
              set={isCreated}
              setter={setIsCreated}
              ref={addNewCampaignRef}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Campaigns;
