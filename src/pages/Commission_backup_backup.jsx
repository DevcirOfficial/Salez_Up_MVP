

// this code has all functionalities and it is recent code. 


import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import axios from 'axios';
import { Plus,FilePenLine} from 'lucide-react';
// import logo from '../../public/icons/Editing.png'
const Commission3 = () => {

// ------------------------- Declerations-----------------------------------//

    const [kpiTableVisible, setKpiTableVisible] = useState({});
    const [isCreated, setIsCreated] = useState(false);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null); 
 
    const [teamData, setTeamData] = useState({});
    const [teamKpiData, setTeamKpiData] = useState({});
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [opportunity_main, setOpportunity_main] = useState("");
    const currencies = ['$', '£', '€', '¥', '₹'];
    const [kpis, setKpis] = useState([]);
    const [selectedKpiId, setSelectedKpiId] = useState(null);
    const [kpiData, setKpiData] = useState([]);
    const [countData, setCountData] = useState(0); 
    const [kpisInTable, setKpisInTable] = useState(0);
    const [filteredTeams, setFilteredTeams] = useState([]);
  // -------------------- Custom KPI Data ------------------------------//
    const [customKpiData, setCustomKpiData] = useState({});


    const handleCustomKpiInputChange = (teamId, index, field, value) => {
        setCustomKpiData(prevData => {
            const newTeamData = [...(prevData[teamId] || [])];
            newTeamData[index] = { ...newTeamData[index], [field]: value };
            if (field == 'Custom_Weighting') {
                const teamOpportunity = teamData[teamId]?.opportunity || 0;
                const weightingValue = parseFloat(value) || 0;
                const calculatedOpportunity = (weightingValue / 100) * teamOpportunity;
                newTeamData[index].Custom_Opportunity = calculatedOpportunity.toFixed(2);
            }
            return { ...prevData, [teamId]: newTeamData };
        });
    };


    const handleCustomWeightingChange = (teamId, index, value) => {
        if (parseFloat(value) > 100) {
            alert("Enter a value between 1 and 100");
            return;
        }

        setCustomKpiData(prevData => {
            const newTeamData = [...(prevData[teamId] || [])];
            const teamOpportunity = teamData[teamId]?.opportunity || 0;
            const weightingValue = parseFloat(value) || 0;
            const calculatedOpportunity = (weightingValue / 100) * teamOpportunity;
            newTeamData[index] = { ...newTeamData[index], Custom_Weighting: value, Custom_Opportunity: calculatedOpportunity.toFixed(2) };
            return { ...prevData, [teamId]: newTeamData };
        });
    };

    
    useEffect(() => {
        console.log("Updated customKpiData:", customKpiData);
    }, [customKpiData]);

    //----------------------------------------------------------------------------------//

    const handleSelectChange = (teamId, field, value) => {
        setTeamData(prevData => ({
          ...prevData,
          [teamId]: {
            ...(prevData[teamId] || {}),
            [field]: value
          }
        }));
      };


    const handleCampaignClick = (campaign) => {
        console.log("The id of the campaign is: ",campaign.id);
        console.log("The team id associated with the campaign is:", campaign.team_id);
        setSelectedCampaign(campaign);
        const filtered = teams.filter(team => team.campaign == campaign.id);
        setFilteredTeams(filtered);
    };


    const handleInputChange = (teamId, index, field, value) => {
        setTeamKpiData(prevData => {
          const newTeamData = [...(prevData[teamId] || [])];
          newTeamData[index] = { ...newTeamData[index], [field]: value };
          if (field == 'weighting') {
            const teamOpportunity = teamData[teamId]?.opportunity || 0;
            const weightingValue = parseFloat(value) || 0;
            const calculatedOpportunity = (weightingValue / 100) * teamOpportunity;
            newTeamData[index].opportunity = calculatedOpportunity.toFixed(2);
          }
          return { ...prevData, [teamId]: newTeamData };
        });
      };

      const handleInputChange1 = (teamId, index, field, value) => {
        if (field == 'weighting' && (parseFloat(value) < 1 || parseFloat(value) > 100)) {
            alert("Enter a value between 1 and 100 only");
            return;
        }
        
        setTeamKpiData(prevData => {
            const newTeamData = [...(prevData[teamId] || [])];
            newTeamData[index] = { ...newTeamData[index], [field]: value };
            if (field == 'weighting') {
                const teamOpportunity = teamData[teamId]?.opportunity || 0;
                const weightingValue = parseFloat(value) || 0;
                const calculatedOpportunity = (weightingValue / 100) * teamOpportunity;
                newTeamData[index].opportunity = calculatedOpportunity.toFixed(2);
            }
            return { ...prevData, [teamId]: newTeamData };
        });
    };

    const handleAddCustomKPI = (teamId) => {
        if (kpisInTable < countData) {
            setTeamKpiData(prevData => {
                const newData = {
                    ...prevData,
                    [teamId]: [
                        ...(prevData[teamId] || []),
                        {
                            kpi_Name_ID: selectedKpiId,
                            target: "",
                            weighting: "",
                            opportunity: "999",
                            gatekeeper: "",
                            team_id: teamId,
                        }
                    ]
                };
                return newData;
            });
            setKpisInTable(prevCount => prevCount + 1);
            setKpiTableVisible(prevState => ({
                ...prevState,
                [teamId]: true
            }));
        } else {
            console.log("Maximum number of KPIs reached");
        }
    };
    
    const handleAddCustomKpiRow = (teamId) => {
        if (kpisInTable < countData) {
            setCustomKpiData(prevData => ({
                ...prevData,
                [teamId]: [
                    ...(prevData[teamId] || []),
                    {
                        Custom_KPI_Name: "",
                        Custom_Target: "",
                        Custom_Weighting: "",
                        Custom_Opportunity: 0,
                        Custom_Gatekeeper: "",
                        team_id: teamId,
                    }
                ]
            }));
            setKpisInTable(prevCount => prevCount + 1);
            setKpiTableVisible(prevState => ({
                ...prevState,
                [teamId]: true
            }));
        } else {
            console.log("Maximum number of KPIs reached");
        }
    };
   // ------------------------------ UseEffect -------------------------------------//
    
   useEffect(() => {
        const fetchData = async () => {
            try {
                const campaignResponse = await axios.get('https://crmapi.devcir.co/api/campaigns');
                const teamResponse = await axios.get('https://crmapi.devcir.co/api/teams');
                setCampaigns(campaignResponse.data);
                setTeams(teamResponse.data);
                if (campaignResponse.data.length > 0) {
                    setSelectedCampaign(campaignResponse.data[0]);
                    const initialFilteredTeams = teamResponse.data.filter(team => team.campaign == campaignResponse.data[0].id);
                    setFilteredTeams(initialFilteredTeams);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log("Value in Opportunity: ", opportunity_main);
    }, [kpiData]);


    useEffect(() => {
        setTeamKpiData(prevData => {
          const newData = { ...prevData };
          Object.keys(newData).forEach(teamId => {
            const teamOpportunity = teamData[teamId]?.opportunity || 0;
            newData[teamId] = newData[teamId].map(kpi => ({
              ...kpi,
              opportunity: ((parseFloat(kpi.weighting) || 0) / 100 * teamOpportunity).toFixed(2)
            }));
          });
          return newData;
        });
      }, [teamData]);
  
    useEffect(() => {
        axios.get('https://crmapi.devcir.co/api/kpi_info')
            .then(response => {
                const kpis = response.data;
                setKpis(kpis);
                setCountData(kpis.length);
                console.log('Number of KPIs:', kpis.length);
            })
            .catch(error => {
                console.error('There was an error fetching the KPI data!', error);
            });
    }, []);


    const handleTeamClick = (team) => {
        setSelectedTeam(team);
    };
    const handleKpiChange = (event, teamId, index) => {
        const selectedId = event.target.value;
        console.log("Selected KPI ID:", selectedId);
        setTeamKpiData(prevData => {
            const newTeamData = [...(prevData[teamId] || [])];
            newTeamData[index] = { 
                ...newTeamData[index], 
                kpi_Name_ID: selectedId
            };
            console.log("Updated KPI data for team:", teamId, "index:", index, "new data:", newTeamData[index]);
            return { ...prevData, [teamId]: newTeamData };
        });
    };
    useEffect(() => {
        console.log("Updated teamKpiData:", teamKpiData);
    }, [teamKpiData]);


    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('https://crmapi.devcir.co/api/teams');
                const data = await response.json();
                const activeTeams = data.filter(team => team.status == 'active');
                setTeams(activeTeams);
                console.log("teams: ", teams);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };
        fetchTeams();
    }, [isCreated]);


    // _________________________________________________________________

    const handleSave = (teamId) => {
        const savedTeamData = {
            id: teamId,
            kpiData: teamKpiData[teamId] || [],
            customKpiData: customKpiData[teamId] || [],
            teamInfo: {
                month: teamData[teamId]?.month,
                frequency: teamData[teamId]?.frequency,
                currency: teamData[teamId]?.currency,
                opportunity: teamData[teamId]?.opportunity
            }
        };
    
        console.log(JSON.stringify(savedTeamData, null, 2));
    };








    return (
        <div className='mx-2'>
            <Navbar />
            <div className='flex gap-3'>
                <SideBar />
                <div className='w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4'>
                    <h1 className='text-[28px] leading-[42px] text-[#555555] font-[500] -mb-6'>Commission</h1>
                    <div className='flex flex-col w-full gap-6 p-8 pb-12 card'>
                        <div>
                            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Targets and Commission <span className='font-[600] text-[14px] leading-[21px] text-[#666666] ml-[14px]'>Sales Agent</span> </h1>
<div className='flex flex-row flex-wrap justify-end w-full'>
                                {campaigns.map((campaign, index) => (
                                    <img
                                        src={campaign.company_logo}
                                        key={index}
                                        className={`${campaign == selectedCampaign ? "" : "opacity-40"} w-[40px] h-[40px] mx-3 cursor-pointer`}
                                        onClick={() => handleCampaignClick(campaign)}
                                    />
                                ))}
                            </div>
                        </div>
                        {filteredTeams.map((team, index) => (
                           <div key={index} onClick={() => handleTeamClick(team)} >
                                <div className='flex items-center justify-between w-full'>
                                    <div className='h-[110px] gap-[12px] flex  justify-between items-center'>
                                    <div className='w-[142px] h-[82px] mt-[26px]'>
                                            <label htmlFor={`team-${index}`} className='text-[14px] font-normal leading-[21px] text-left'>Team</label>
                                            <div className="border-[1px] border-lGreen rounded-[6px] bg-white p-2 text-[14px] font-[500] h-[45px] flex items-center">
                                                <input
                                                    type="text"
                                                    id={`team-${index}`}
                                                    value={team.team_name}
                                                    readOnly
                                                    className="w-full bg-transparent border-none"
                                                />
                                            </div>
                                        </div>
                                        <div className='w-[156px] h-[82px] mt-6'>
                                            <label htmlFor="month" className='text-[14px] font-normal leading-[21px] text-left'>Month</label>
                                           <select
                                                id="month"
                                                value={teamData[team.id]?.month || ""}
                                                onChange={(e) => handleSelectChange(team.id, 'month', e.target.value)}
                                                className="[box-shadow:0px_4px_4px_0px_#40908417] cursor-pointer w-full rounded-[6px] bg-white p-2 text-[14px] font-[500] border-none h-[45px]"
                                            >
                                            <option value="">Select a month</option>
                                            <option value="January">January</option>
                                            <option value="February">February</option>
                                            <option value="March">March</option>
                                            <option value="April">April</option>
                                            <option value="May">May</option>
                                            <option value="June">June</option>
                                            <option value="July">July</option>
                                            <option value="August">August</option>
                                            <option value="September">September</option>
                                            <option value="October">October</option>
                                            <option value="November">November</option>
                                            <option value="December">December</option>
                                            </select> 
                                        </div>
                                        <div className='w-[170px] h-[82px] flex-col flex mt-[30px]'>
                                            <label htmlFor="frequency" className='text-[14px] font-normal leading-[21px] text-left'>Frequency</label>
                                            <select
                                                id="frequency"
                                                className="[box-shadow:0px_4px_4px_0px_#40908417] cursor-pointer w-full rounded-[6px] bg-white p-2 text-[14px]  font-[500] border-none h-[45px]"
                                                value={teamData[team.id]?.frequency || ""}
                                                onChange={(e) => handleSelectChange(team.id, 'frequency', e.target.value)}
                                          >
                                                <option value="" disabled>
                                                    Select Frequency
                                                </option>
                                                <option value="Quarterly">
                                                    Quarterly
                                                </option>
                                                <option value="Monthly">
                                                    Monthly
                                                </option>
                                                <option value="Annually">
                                                    Annually
                                                </option>
                                            </select>
                                        </div>
                                        <div className='relative w-[144px]  h-[82px] flex-col flex mt-[30px]'>
                                            <label htmlFor="Opportunity" className='text-[14px] font-normal leading-[21px] text-left'>Opportunity</label>
                                            <select
                                                className='absolute  mt-[23px] left-0 bg-transparent border-none  text-[14px] font-[500] h-[45px] cursor-pointer'
                                             value={teamData[team.id]?.currency || ""}
                                             onChange={(e) => handleSelectChange(team.id, 'currency', e.target.value)}
                                                style={{ appearance: 'none' }}
                                            >
                                                {currencies.map((cur) => (
                                                    <option key={cur} value={cur}>
                                                        {cur}
                                                    </option>
                                                ))}
                                            </select>
                                            <input type="text"
                                                id='Opportunity'
                                                className='w-full bg-lGreen rounded-[6px] pl-16 placeholder:pl-2 p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]'
                                                placeholder='1000'
                                                value={teamData[team.id]?.opportunity || ""}
                                                onChange={(e) => handleSelectChange(team.id, 'opportunity', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='w-[261px] h-[36px] flex justify-between'>
                                        <button onClick={() => handleSave(team.id)} className='bg-themeGreen w-[106px] h-full rounded-[10px] text-white tracking-[1%] font-[500] text-[16px]'>
                                            Save
                                        </button>
                                    </div>
                                </div>
                                {kpiTableVisible[team.id] && kpisInTable > 0 && (
                                    <div className='pb-4 mt-4 [box-shadow:0px_4px_4px_0px_#40908417] rounded-[10px] '>
                     
                                   <table className="table w-full">
    <thead>
        <tr className='text-xs '>
            <th>KPI</th>
            <th>Target</th>
            <th>Weighting</th>
            <th>Opportunity</th>
            <th>Gatekeeper</th>
        </tr>
    </thead>
    <tbody>
        {teamKpiData[team.id] && teamKpiData[team.id].map((kpi, index) => (
            <tr key={index} className='text-center'>
                <td>
<select
    className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[3px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
    value={kpi.kpi_Name_ID || ''}
    onChange={(event) => handleKpiChange(event, team.id, index)}
>
    <option value="">Select KPI</option>
    {kpis.map((kpiOption) => (
        <option key={kpiOption.id} value={kpiOption.id}>
            {kpiOption.kpi_name}
        </option>
    ))}
</select>
                </td>
                <td>
                    <input
                        type="text"
                        className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                        value={kpi.target}
                        placeholder="Enter Target"
                        onChange={(e) => handleInputChange(team.id, index, 'target', e.target.value)}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                        value={kpi.weighting}
                        placeholder="Enter Weighting"
                        onChange={(event) => handleInputChange1(selectedTeam.id, index, 'weighting', event.target.value)}
                        // onChange={(e) => handleInputChange(team.id, index, 'weighting', e.target.value)}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                        placeholder="Enter Opportunity"
                        onChange={(e) => handleInputChange(team.id, index, 'opportunity', e.target.value)}
                        readOnly
                        // value={(kpi.weighting/100) * (teamData[team.id]?.opportunity || 0)}
                        value={parseFloat(((kpi.weighting / 100) * (teamData[team.id]?.opportunity || 0)).toFixed(2))}


                    />
                </td>
                <td>
                    <input
                        type="text"
                        className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                        value={kpi.gatekeeper}
                        onChange={(e) => handleInputChange(team.id, index, 'gatekeeper', e.target.value)}
                        placeholder='N/A'
                    />
                </td>
            </tr>
        ))}




{customKpiData[team.id] && customKpiData[team.id].map((customKpi, index) => (
    <tr key={`custom-${team.id}-${index}`} className='text-center'>
        <td>
            <input
                type="text"
                className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                value={customKpi.Custom_KPI_Name}
                placeholder="Custom KPI Name"
                onChange={(e) => handleCustomKpiInputChange(team.id, index, 'Custom_KPI_Name', e.target.value)}
            />
        </td>
        <td>
            <input
                type="text"
                className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                value={customKpi.Custom_Target}
                placeholder="Custom Target"
                onChange={(e) => handleCustomKpiInputChange(team.id, index, 'Custom_Target', e.target.value)}
            />
        </td>
        <td>
            <input
                type="text"
                className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                value={customKpi.Custom_Weighting}
                placeholder="Custom Weighting"
                onChange={(e) => handleCustomWeightingChange(team.id, index, e.target.value)}
                // onChange={(e) => handleCustomKpiInputChange(team.id, index, 'Custom_Weighting', e.target.value)}
                
            />
        </td>
        <td>
            <input
                type="text"
                className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                value={customKpi.Custom_Opportunity}
                placeholder="Custom Opportunity"
                readOnly
            />
        </td>
        <td>
            <input
                type="text"
                className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                value={customKpi.Custom_Gatekeeper}
                placeholder="Custom Gatekeeper"
                onChange={(e) => handleCustomKpiInputChange(team.id, index, 'Custom_Gatekeeper', e.target.value)}
            />
        </td>
    </tr>
))}




    </tbody>
</table>
                                    </div>
                                )}
                                <div className='flex justify-end w-full mt-6'>
                                    <button
                                        className=' tracking-[1%] [box-shadow:0px_4px_4px_0px_#40908417] bg-white flex justify-center items-center h-[50px] w-[157px] rounded-[10px] gap-[10px] text-black font-[600] text-[14px]'
                                        onClick={() => handleAddCustomKPI(team.id)}
                                    >
                                        <Plus className='text-[#1E8675]'/> Add KPI
                                    </button>
                                    <button
                                        className='tracking-[1%] [box-shadow:0px_4px_4px_0px_#40908417] bg-white text-black flex justify-center items-center h-[50px] w-[200px] rounded-[10px] gap-[10px]  font-[600] text-[14px] ml-4'
                                        //onClick={handleAddCustomKpiRow}
                                        onClick={() => handleAddCustomKpiRow(team.id)}
                                    >
                                       Add Custom KPI
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Commission3;