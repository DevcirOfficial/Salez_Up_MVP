import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import Select from 'react-select';
import axios from 'axios';
import Current_Agent from './Current_Agent';
import AddNewAgent from './AddNewAgent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch as faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// --------------------------- Saving Data ------------------------------//
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const UpdateModal = ({ isOpen, onClose, data }) => {
  const [name, setName] = useState(data.name);
  const [surname, setSurname] = useState(data.surname);
  const [agentpic, setAgentpic] = useState(data.image_path);
  const [lead_stname, setLead_stname] = useState(formatDate(data.start_date));
  const [commission, setCommission] = useState(data.commission);
  const [target, setTarget] = useState(data.target);
  const [frequency, setFrequency] = useState(data.frequency);
  const [teams, setTeams] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [campaignDetails, setCampaignDetails] = useState(data.campaign_details);
  const campaignsIds = useRef({});
  const addCampaign = (name, id) => {
    campaignsIds.current[name] = id;
  };
  const getCampaignId = (name) => {
    return campaignsIds.current[name];
  };
  const leaderIds = useRef({});
  const addLeader = (name, id) => {
    leaderIds.current[name] = id;
  };
  const getLeaderId = (name) => {
    return leaderIds.current[name];
  };
  useEffect(() => {
    axios.get('https://crmapi.devcir.co/api/teams')
      .then(response => {
        setTeams(response.data.filter(team => team.status == 'active'));
      })
      .catch(error => console.error('Error fetching teams:', error));
    axios.get('https://crmapi.devcir.co/api/campaigns')
      .then(response => {
        const fetchedCampaigns = response.data;
        setCampaigns(response.data);
        fetchedCampaigns.forEach(campaign => addCampaign(campaign.name, campaign.id));
      })
      .catch(error => console.error('Error fetching campaigns:', error));
    axios.get('https://crmapi.devcir.co/api/team_leaders')
      .then(response => {
        const fetchedLeaders = response.data;
        setLeaders(response.data);
        fetchedLeaders.forEach(leader => addLeader(leader.name, leader.id));
      })
      .catch(error => console.error('Error fetching leaders:', error));
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCampaignDetails = campaignDetails.map(detail => ({
      ...detail,
      campaign_id: getCampaignId(detail.campaign_name),
      team_leader_id: getLeaderId(detail.team_leader_name),
      team_id: teams.find(t => t.team_name == detail.team_name)?.id,
    }));
    const formattedData = updatedCampaignDetails.reduce((acc, detail) => {
      acc[detail.campaign_id] = {
        team: detail.team_id,
        teamLeader: detail.team_leader_id,
        partition: detail.Partition
      };
      return acc;
    }, {});
    const updatedData = {
      name,
      surname,
      start_date: lead_stname,
      commission,
      target,
      frequency,
      campaign: formattedData,
    };
    axios.put(`https://crmapi.devcir.co/api/sales_agents_update/${data.id}`, updatedData)
      .then(response => {
        toast.success('Agent successfully updated', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log('Update successful:', response.data);
        onClose();
        // window.location.reload();
      })
      .catch(error => console.error('Error updating sales agent:', error));
  };
  if (!isOpen) return null;
  const handleCampaignDetailChange = (index, field, value) => {
    const updatedDetails = [...campaignDetails];
    updatedDetails[index][field] = value;
    setCampaignDetails(updatedDetails);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75"></div>
      <div className="relative z-50 w-full max-w-4xl p-6 m-4 bg-white rounded-lg shadow-lg sm:p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-2xl font-semibold text-center text-themeGreen">Update Sales Agent</h2>
        <div className='w-full'>
          <div className='flex flex-col items-center w-full gap-1 mb-1'>
            <p className='font-[400] text-[14px] text-dGreen text-center'>Update Picture</p>
            <label className="flex flex-col items-center justify-center w-[100px] h-[100px] rounded-full bg-lGreen cursor-pointer">
              <div className="flex flex-col items-center justify-center pt-7">
                <img src={agentpic} className="w-[82px] h-[82px] rounded-full mt-11 mb-8" alt="" />
              </div>
              <input type="file" className="opacity-0" />
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="mb-1">
            <label className="block text-themeGray text-sm font-[500] mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className='w-full rounded-[6px] border-none bg-lGreen p-2 text-[14px] ' />
          </div>
          <div className="mb-1">
            <label className='block text-themeGray text-sm font-[500] mb-1'>Surname</label>
            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)}
              className='w-full rounded-[6px] border-none bg-lGreen p-2 text-[14px] ' />
          </div>
          <div className="mb-1">
            <label className='block text-themeGray text-sm font-[500] mb-1'>Commission</label>
            <input type="text" value={commission} onChange={(e) => setCommission(e.target.value)}
              className='w-full border-none rounded-[6px] bg-lGreen p-2 text-[14px] ' />
          </div>
          <div className="mb-1">
            <label className="block text-themeGray text-sm font-[500] mb-1">Start Date</label>
            <div className='relative custom-date-input'>
              <img src="/icons/calendarIcon.png" alt="" className='absolute w-[18px] h-[17px] top-[14px] right-[9px]' />
              <input type="date" id='date'
                className=' date-input text-[#8fa59c] w-full border-none rounded-[6px] bg-lGreen p-2 text-[14px] '
                value={lead_stname}
                onChange={(e) => setLead_stname(e.target.value)} />
            </div>
          </div>
          <div className="mb-1">
            <label htmlFor='target' className='block text-themeGray text-sm font-[500] mb-1'>Target</label>
            <select
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="shadow-[0px_4px_4px_0px_#40908417]  w-full rounded-[6px] bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]"
            >
              <option value="" disabled>Select Target Name</option>
              <option value="Revenue">Revenue</option>
              <option value="Units">Units</option>
            </select>
          </div>
          <div className="mb-1">
            <label className='block text-themeGray text-sm font-[500] mb-1'>Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
              className="shadow-[0px_4px_4px_0px_#40908417] w-full rounded-[6px] bg-lGreen p-2 text-[14px]  font-[500] border-none h-[45px]"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
          {campaignDetails.map((detail, index) => (
            <React.Fragment key={index}>
              <h1 className="col-span-2 text-lg font-semibold">Campaign Number: {index + 1}</h1>
              <div className="grid grid-cols-2 col-span-2 gap-4 mb-1">
                <div>
                  <label className='block text-themeGray text-sm font-[500] mb-1'>Campaign</label>
                  <select value={detail.campaign_name}
                    onChange={(e) => handleCampaignDetailChange(index, 'campaign_name', e.target.value)}
                    className="shadow-[0px_4px_4px_0px_#40908417] w-full rounded-[6px] bg-lGreen p-2 text-[14px]  font-[500] border-none h-[45px]">
                    {campaigns.map(campaign => (
                      <option key={campaign.id} value={campaign.name}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-themeGray text-sm font-[500] mb-1'>Team</label>
                  <select value={detail.team_name}
                    onChange={(e) => handleCampaignDetailChange(index, 'team_name', e.target.value)}
                    className="shadow-[0px_4px_4px_0px_#40908417] w-full rounded-[6px] bg-lGreen p-2 text-[14px]  font-[500] border-none h-[45px]">
                    {teams.map(team => (
                      <option key={team.id} value={team.team_name}>{team.team_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-themeGray text-sm font-[500] mb-1'>Leader</label>
                  <select value={detail.team_leader_name}
                    onChange={(e) => handleCampaignDetailChange(index, 'team_leader_name', e.target.value)}
                    className="shadow-[0px_4px_4px_0px_#40908417] w-full rounded-[6px] bg-lGreen p-2 text-[14px]  font-[500] border-none h-[45px]">
                    {leaders.map(leader => (
                      <option key={leader.id} value={leader.name}>{leader.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-themeGray text-sm font-[500] mb-1'>Partition</label>
                  <input type="text" value={detail.Partition} onChange={(e) => handleCampaignDetailChange(index, 'Partition', e.target.value)}
                    className='w-full border-none rounded-[6px] bg-lGreen p-2 text-[14px] ' />
                </div>
              </div>
            </React.Fragment>
          ))}
          <div className="flex flex-row-reverse justify-between col-span-2 gap-1 mt-7">
            <button type="submit"
              className="flex-1 px-4 py-2 font-bold text-white rounded bg-themeGreen focus:outline-none focus:shadow-outline">Save</button>
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 font-bold text-white bg-red-600 rounded focus:outline-none focus:shadow-outline">Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const SalesAgents = () => {
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [managerIds, setManagerIds] = useState([]);
  const [teamIds, setTeamIds] = useState([]);
  const [campaignIds, setCampaignIds] = useState([]);
  const [isCreated, setIsCreated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [campaignView, setCampaignView] = useState('multiple');
  // ---------------------------  Pagination  ---------------------------------//
  const [currentPage, setCurrentPage] = useState(1);
  const [agentsPerPage] = useState(9);

 

  const renderContent = () => {
    if (campaignView == 'single') {
      return renderTable2();
    } else {
      return renderTable();
    }
  };


  const handleCampaignFilter = (filter) => {
    setCampaignFilter(filter);
  };

  const extractManagerIds = (managerData) => {
    setManagerIds(prevIds => [...prevIds, managerData.id]);
    return managerData.first_name;
  }
  useEffect(() => {
    // Fetch teams
    axios.get('https://crmapi.devcir.co/api/teams')
      .then(response => {
        setAllTeams(response.data.filter(team => team.status == 'active'));
        console.log("dataaaa", allTeams);
      })
      .catch(error => console.error('Error fetching teams:', error));
  }, []);
  const extractTeamIds = (teamData) => {
    setTeamIds(prevIds => [...prevIds, teamData.id]);
    return teamData.team_name;
  }
  const extractCampaignIds = (campaignData) => {
    setCampaignIds(prevIds => [...prevIds, campaignData.id]);
    return campaignData.name;
  }
  const handleUpdate = (data) => {
    setIsUpdateModalOpen(true);
    setSelectedData(data);
  };
  useEffect(() => {
    ////console.log("My Data: ", selectedData);
  }, [selectedData]);
  useEffect(() => {
    fetch('https://crmapi.devcir.co/api/sales_agents')
      .then(response => response.json())
      .then(data => {
        setTeams(data);
        // setFilteredAgents(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [isCreated]);
  // delete functionality __________________________________________________
  const handleDelete = (id) => {
    axios.delete(`https://crmapi.devcir.co/api/sales_agents_delete/${id}`)
      .then(response => {
        // Update state or refetch data after successful delete
        fetch('https://crmapi.devcir.co/api/sales_agents/34')
          .then(response => response.json())
          .then(data => {
            setTeams(data);
            //   alert("Agent is successfully deleted");
            toast.success('Agent successfully deleted', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            window.location.reload();
          })
          .catch(error => console.error('Error fetching data:', error));
      })
      .catch(error => console.error('Error deleting agent:', error));
  };
  // delete functionality _______________________________________________________
  const renderPagination = (totalAgents) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalAgents / agentsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="flex justify-end mt-4">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-4 py-2 mx-1 text-sm font-medium ${currentPage == number ? 'bg-[#1E8675] text-white ' : 'bg-[#F8FDFC] text-[#072D20]'
              } rounded-md`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage == 1}
          className="px-3 py-1 mr-2 text-sm font-medium text-[#072D20] rounded-md bg-[#F8FDFC]"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalAgents / agentsPerPage)))}
          disabled={currentPage == Math.ceil(totalAgents / agentsPerPage)}
          className="px-3 py-1 ml-2 text-sm font-medium text-[#072D20] rounded-md bg-[#F8FDFC]"
        >
          Next
        </button>
      </div>
    );
  };



  const renderTable2 = () => {

        const filteredAgents = teams.filter(agent => 
      agent.campaign_details.length == 1 &&
      (selectedTeam == 'All Teams' || agent.campaign_details[0].team_name == selectedTeam) &&
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  
    );
 
  
    const indexOfLastAgent = currentPage * agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
    const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);
    const noDataAvailable = filteredAgents.length == 0;
  
    return (
      <>
        {noDataAvailable ? (
          <p className="mt-4 text-center">No Data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-[12px] bg-white table-auto">
              
              <thead className="text-themeGreen h-[30px]">
                <tr>
                  <th className="px-4 sm:px-[8px] font-[500] min-w-[50px]"></th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Name</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Surname</th>
                  <th className="px-4 sm:px-[5px] font-[500] min-w-[90px]">Start Date</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Campaign</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Team</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Manager</th>
                  <th className="px-4 sm:px-[20px] font-[500] min-w-[50px]">Commission</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Target</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Frequency</th>
                  <th className="px-4 sm:px-[10px] min-w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="font-[400] bg-white">
                {currentAgents.map((agent, index) => (
                  <tr key={index} className="bg-[#F8FEFD] my-[8px] text-center">
                    {agent.campaign_details.length == 1 ? (
                      <>
                        <td className="px-4 sm:px-[10px]">
                          <img src={agent.image_path} className="w-[40px] h-[40px] rounded-full m-auto" alt="" />
                        </td>
                        <td className="px-2 sm:px-[10px]">{agent.name}</td>
                        <td className="px-2 sm:px-[10px]">{agent.surname}</td>
                        <td className="px-2 sm:px-[5px]">{formatDate(agent.start_date)}</td>
                        <td className="px-2 sm:px-[10px]">{agent.campaign_details[0].campaign_name}</td>
                        <td className="px-2 sm:px-[10px]">{agent.campaign_details[0].team_name}</td>
                        <td className="px-2 sm:px-[10px]">{agent.campaign_details[0].team_leader_name}</td>
                        <td className="px-2 sm:px-[10px]">{agent.commission}</td>
                        <td className="px-2 sm:px-[10px]">{agent.target}</td>
                        <td className="px-2 sm:px-[10px]">{agent.frequency}</td>
                        <td className="px-4 sm:px-[10px] py-[10px]">
                          <span className="mx-1 cursor-pointer" onClick={() => handleUpdate(agent)}>
                            <img src="../images/edit.png" className="inline h-[18px] w-[18px]" alt="" />
                          </span>
                          <span className="mx-1 cursor-pointer" onClick={() => handleDelete(agent.id)}>
                            <img src="../images/delete.png" className="inline h-[18px] w-[18px]" alt="" />
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 sm:px-[10px]">
                          <img src={agent.image_path} className="w-[40px] h-[40px] rounded-full m-auto" alt="" />
                        </td>
                        <td className="px-2 sm:px-[10px]">
                          <p>{agent.name}</p>
                        </td>
                        <td className="px-2 sm:px-[10px]">
                          <p>{agent.surname}</p>
                        </td>
                        <td className="px-2 sm:px-[5px]">
                          <p>{formatDate(agent.start_date)}</p>
                        </td>
                        <td className="px-2 sm:px-[10px]">
                          <p>{agent.name}</p>
                        </td>
                        <td className="px-2 sm:px-[10px]">
                          <p>{agent.commission}</p>
                        </td>
                        <td className="px-2 sm:px-[10px]">
                          <p>{agent.target}</p>
                        </td>
                        <td className="px-2 sm:px-[10px]">
                          <p>{agent.frequency}</p>
                        </td>
                        <td className="px-2 sm:px-[20px]">
                          <table className="text-[8px] table-fixed border-collapse">
                            <thead>
                              <tr>
                                <th className="px-[3px] border-2">Campaign Name</th>
                                <th className="px-[3px] border-2">Team Name</th>
                                <th className="px-[3px] border-2">Team Leader</th>
                                <th className="px-[3px] border-2">Partition</th>
                              </tr>
                            </thead>
                            <tbody>
                              {agent.campaign_details.map((campaign, i) => (
                                <tr key={i}>
                                  <td className="px-[3px] border-2">{campaign.campaign_name}</td>
                                  <td className="px-[3px] border-2">{campaign.team_name}</td>
                                  <td className="px-[3px] border-2">{campaign.team_leader_name}</td>
                                  <td className="px-[3px] border-2">{campaign.Partition}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                        <td className="px-4 sm:px-[10px] py-[10px]">
                          <span className="mx-1 cursor-pointer" onClick={() => handleUpdate(agent)}>
                            <img src="../images/edit.png" className="inline h-[18px] w-[18px]" alt="" />
                          </span>
                          <span className="mx-1 cursor-pointer" onClick={() => handleDelete(agent.id)}>
                            <img src="../images/delete.png" className="inline h-[18px] w-[18px]" alt="" />
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(filteredAgents.length)}
          </div>
        )}
        {isUpdateModalOpen && <UpdateModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} data={selectedData} />}
      </>
    );
  };






  const renderTable = () => {



    
    const filteredAgents = teams.filter(agent => 
      agent.campaign_details.length > 1 &&
      (selectedTeam == 'All Teams' || agent.campaign_details.some(campaign => campaign.team_name == selectedTeam)) &&
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastAgent = currentPage * agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
    const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);
    const noDataAvailable = filteredAgents.length == 0;

    return (
      <>
        {noDataAvailable ? (
          <p className="mt-4 text-center">No Data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-[12px] bg-white table-auto">
              <thead className="text-themeGreen h-[30px]">
                <tr>
                  <th className="px-4 sm:px-[8px] font-[500] min-w-[50px]"></th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Name</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Surname</th>
                  <th className="px-4 sm:px-[5px] font-[500] min-w-[90px]">Start Date</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Campaign</th>
                  <th className="px-4 sm:px-[20px] font-[500] min-w-[50px]">Commission</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Target</th>
                  <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Frequency</th>
                  <th className="px-2 sm:px-[10px] font-[500] w-[40px]">Campaign Details</th>
                  <th className="px-4 sm:px-[10px] min-w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="font-[400] bg-white">
                {currentAgents.map((agent, index) => (
                  <tr key={index} className="bg-[#F8FEFD] my-[8px] text-center">
                    <td className="px-4 sm:px-[10px]">
                      <img src={agent.image_path} className="w-[40px] h-[40px] rounded-full m-auto" alt="" />
                    </td>
                    <td className="px-2 sm:px-[10px]">
                      <p>{agent.name}</p>
                    </td>
                    <td className="px-2 sm:px-[10px]">
                      <p>{agent.surname}</p>
                    </td>
                    <td className="px-2 sm:px-[5px]">
                      <p>{formatDate(agent.start_date)}</p>
                    </td>
                    <td className="px-2 sm:px-[10px]">
                      <p>{agent.name}</p>
                    </td>
                    <td className="px-2 sm:px-[10px]">
                      <p>{agent.commission}</p>
                    </td>
                    <td className="px-2 sm:px-[10px]">
                      <p>{agent.target}</p>
                    </td>
                    <td className="px-2 sm:px-[10px]">
                      <p>{agent.frequency}</p>
                    </td>
                    <td className="px-2 sm:px-[20px]">
                      <table className="text-[8px] table-fixed border-collapse">
                        <thead>
                          <tr>
                            <th className="px-[3px] border-2">Campaign Name</th>
                            <th className="px-[3px] border-2">Team Name</th>
                            <th className="px-[3px] border-2">Team Leader</th>
                            <th className="px-[3px] border-2">Partition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agent.campaign_details.map((campaign, i) => (
                            <tr key={i}>
                              <td className="px-[3px] border-2">{campaign.campaign_name}</td>
                              <td className="px-[3px] border-2">{campaign.team_name}</td>
                              <td className="px-[3px] border-2">{campaign.team_leader_name}</td>
                              <td className="px-[3px] border-2">{campaign.Partition}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td className="px-4 sm:px-[10px] py-[10px]">
                      <span className="mx-1 cursor-pointer" onClick={() => handleUpdate(agent)}>
                        <img src="../images/edit.png" className="inline h-[18px] w-[18px]" alt="" />
                      </span>
                      <span className="mx-1 cursor-pointer" onClick={() => handleDelete(agent.id)}>
                        <img src="../images/delete.png" className="inline h-[18px] w-[18px]" alt="" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(filteredAgents.length)}
          </div>
        )}
        {isUpdateModalOpen && <UpdateModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} data={selectedData} />}
      </>
    );
  };
  //------------------------------------------ Filteration -------------------------------------------------//
  const handleStoreCSV = async () => {
    try {
      const headers = [
        "Name",
        "Surname",
        "Start Date",
        "Campaign",
        "Target",
        "Frequency",
        "Commission Details" 
      ];
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales Agents');
   
      worksheet.addRow(headers);
      worksheet.getRow(1).font = { bold: true };

      const rows = document.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
   
        const name = cells[1]?.innerText.trim() || '';
        const surname = cells[2]?.innerText.trim() || '';
        const startDate = cells[3]?.innerText.trim() || '';
        const campaign = cells[4]?.innerText.trim() || '';
        const target = cells[6]?.innerText.trim() || '';
        const frequency = cells[7]?.innerText.trim() || '';
      
        let commissionDetails = '';
        if (cells[8]) {
          const commissionTable = cells[8].querySelectorAll('tbody tr');
          commissionDetails = Array.from(commissionTable).map(commRow => {
            const commCells = commRow.querySelectorAll('td');
            const campaignName = commCells[0]?.innerText.trim() || '';
            const teamName = commCells[1]?.innerText.trim() || '';
            const teamLeader = commCells[2]?.innerText.trim() || '';
            const partition = commCells[3]?.innerText.trim() || '';
            return `Campaign: ${campaignName}, Team: ${teamName}, Leader: ${teamLeader}, Partition: ${partition}`;
          }).join(' | ');  
        }

        worksheet.addRow([
          name,
          surname,
          startDate,
          campaign,
          target,
          frequency,
          commissionDetails   
        ]);
      });
      
      const buffer = await workbook.xlsx.writeBuffer();
    
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Sales_Agents_Data.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
    }
  };
  return (





            // <div className='flex flex-wrap items-center gap-[10px] justify-between lg:justify-start'>
              // <div className='cursor-pointer' onClick={() => setSelectedTeam('All Teams')}>
              //   <p className={`w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] ${selectedTeam == 'All Teams' ? "bg-themeGreen text-white font-[600]" : "bg-lGreen text-black font-[400]"}`}>All Teams</p>
              // </div>
              // {[...new Set(allTeams.map(team => team.team_name))].map((teamName, index) => (
              //   <div key={index} className='cursor-pointer' onClick={() => setSelectedTeam(teamName)}>
              //     <p className={`${selectedTeam == teamName ? "bg-themeGreen text-white font-[600]" : "bg-lGreen text-black font-[400]"} w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px]`}>{teamName}</p>
              //   </div>
              // ))}
              // <div className="relative pt-2 mx-auto text-gray-600">
              //   <input
              //     className="h-10 px-7 pr-16 text-sm bg-[#f7f7f7]  placeholder:text-gray-600 placeholder:text-md border-2 border-gray-300 rounded-lg focus:outline-none"
              //     type="search"
              //     name="search"
              //     placeholder="Enter Name"
              //     value={searchQuery}
              //     onChange={(e) => setSearchQuery(e.target.value)}
              //   />
              //   <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-0 mt-3 mr-4 top-2 text-[#269F8B]" />
              // </div>
              // <button onClick={handleStoreCSV} className='bg-themeGreen w-[150px] p-2 h-full rounded-[10px] text-white tracking-[1%] font-[500] text-[15px]'>
              //   Export Agents  <FontAwesomeIcon icon={faDownload} className='ml-2' />
              // </button>
            // </div>
//             {renderTable()}
//           </div>
//           <AddNewAgent id="addNewAgent" set={isCreated} setter={setIsCreated} />
//         </div>
//       </div>
//       <ToastContainer />
//     </div>



<div className='mx-2'>
<Navbar />
<div className='flex gap-3'>
  <SideBar />
  <div className='w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4'>
    <h1 className='text-[28px] leading-[42px] text-[#555555] font-[500] -mb-6'>Sales Agent</h1>
    <Current_Agent id="orgChart" />
    <div className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentAgent'>
      <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Current Agents</h1>
      
      {/* Add the campaign view toggle buttons here */}
      <div className='flex justify-center gap-4 mb-4'>
        <button 
          onClick={() => setCampaignView('single')}
          className={`px-4 py-2 rounded-[10px] ${campaignView == 'single' ? 'bg-themeGreen text-white' : 'bg-lGreen text-black'}`}
        >
          Single Campaign
        </button>
        <button 
          onClick={() => setCampaignView('multiple')}
          className={`px-4 py-2 rounded-[10px] ${campaignView == 'multiple' ? 'bg-themeGreen text-white' : 'bg-lGreen text-black'}`}
        >
          Multiple Campaigns
        </button>
      </div>

      <div className='flex flex-wrap items-center gap-[10px] justify-between lg:justify-start'>

        <div className='cursor-pointer' onClick={() => setSelectedTeam('All Teams')}>
                <p className={`w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] ${selectedTeam == 'All Teams' ? "bg-themeGreen text-white font-[600]" : "bg-lGreen text-black font-[400]"}`}>All Teams</p>
              </div>
              {[...new Set(allTeams.map(team => team.team_name))].map((teamName, index) => (
                <div key={index} className='cursor-pointer' onClick={() => setSelectedTeam(teamName)}>
                  <p className={`${selectedTeam == teamName ? "bg-themeGreen text-white font-[600]" : "bg-lGreen text-black font-[400]"} w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px]`}>{teamName}</p>
                </div>
              ))}
              <div className="relative pt-2 mx-auto text-gray-600">
                <input
                  className="h-10 px-7 pr-16 text-sm bg-[#f7f7f7]  placeholder:text-gray-600 placeholder:text-md border-2 border-gray-300 rounded-lg focus:outline-none"
                  type="search"
                  name="search"
                  placeholder="Enter Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-0 mt-3 mr-4 top-2 text-[#269F8B]" />
              </div>
              <button onClick={handleStoreCSV} className='bg-themeGreen w-[150px] p-2 h-full rounded-[10px] text-white tracking-[1%] font-[500] text-[15px]'>
                Export Agents  <FontAwesomeIcon icon={faDownload} className='ml-2' />
              </button>


      </div>
      
      {renderContent()} 
    </div>
    <AddNewAgent id="addNewAgent" set={isCreated} setter={setIsCreated} />
  </div>
</div>
<ToastContainer />
</div>
  )
}
export default SalesAgents;