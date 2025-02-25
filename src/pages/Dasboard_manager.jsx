import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import './ManagerChart.css';
import fallbackImage from "/public/images/image_not_1.jfif";

const Dashboard_manager = () => {

  const [selectedButton, setSelectedButton] = useState('Current Month');
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpen, setIsOpen] = useState(false);
  const years = Array.from({ length: 101 }, (_, i) => currentYear - i);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const getButtonClasses = (buttonName) =>
    buttonName == selectedButton
      ? 'px-4 py-1 border-2 border-[#1E8675] text-[#009245] rounded-lg text-xs'
      : 'px-4 py-1 border-2 border-[#E5E5E5] text-[#072D20] rounded-lg text-xs';


  const handleYearChange = (year) => {
    setSelectedYear(year);
    console.log(`Year Selected: `, year);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const prizes = [
    { name: 'Cash', amount: 50, iconSrc: '/images/cash.png' },
    { name: 'Vouchers', amount: 50, iconSrc: '/images/voucher.png' },
    { name: 'Food', amount: 50, iconSrc: '/images/food.png' },
    { name: 'Experiences', amount: 0, iconSrc: '/images/experience.png' }
  ];

  const Badge = ({ rank }) => {
    const images = {
      1: '/images/1stprizes.png',
      2: '/images/2prize.png',
      3: '/images/3prize.png',
    };

    return (
      <>
        {rank <= 3 && (
          <div className="absolute -top-3  w-12 h-12 rounded-full">
            <img
              src={images[rank]}
              alt={`Rank ${rank}`}
              className="w-14 h-14 object-cover"
            />
          </div>
        )}
      </>
    );
  };

  const LeaderboardItem = ({ rank, name, score, image }) => {
    // Dynamically determine the badge based on rank
    let badge;
    if (rank == 1) {
      badge = '/images/unicorn.png';
    } else if (rank == 2) {
      badge = '/images/platinium.png';
    } else if (rank == 3) {
      badge = '/images/gold.png';
    } else if (rank == 4 || rank == 5) {
      badge = '/images/silver.png';
    } else {
      badge = '/images/bronze.png';
    }

    return (
      <div className="flex items-center mb-4 w-full">
        <div className="relative w-8 text-center">
          <Badge rank={rank} />
          <div className={`w-10 text-center text-lg font-semibold ${rank <= 3 ? 'invisible' : 'text-[#327D71]'}`}>
            {rank}
          </div>
        </div>

        <div className="relative w-16 h-16 rounded-full ml-6">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />

          <img
            src={badge} // Dynamically set badge here
            alt="Badge"
            className="absolute bottom-0 top-9 left-10 w-8 h-8 z-10"
          />
        </div>

        <div className="text-mm font-semibold ml-6 w-32 truncate text-[#009245]">{name}</div>
        <div className="flex-grow mx-4 relative">
          <div className="bg-[#C6E5D5] rounded-full h-3 relative overflow-hidden">
            <div
              className="h-3 rounded-full"
              style={{
                width: `${Math.min((score / (score + 50)) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #1A7465 0%, #2DDAB9 100%)',
              }}
            ></div>
            <div
              className="absolute font-bold bg-white text-[#009245] text-xs rounded px-4 py-1"
              style={{
                top: '-6px',
                left: `calc(${Math.min((score / (score + 50)) * 100, 100)}% - 20px)`,
                zIndex: 10,
              }}
            >
              {score}
            </div>
            <div
              className="absolute top-0 h-3 bg-transparent"
              style={{
                left: `${Math.min((score / (score + 40)) * 100, 100)}%`,
                right: 0,
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };


  const Leaderboard = ({ leaderboardData }) => {
    const sortedData = leaderboardData.sort((a, b) => b.score - a.score);

    return (
      <div className="rounded-lg shadow-sm border-2 border-gray-100 py-8 mt-4 w-full max-w-10xl">
        <div className="px-6">
          {sortedData.map((item, index) => (
            <LeaderboardItem
              key={index}
              rank={index + 1}
              name={item.name}
              score={item.score}
              image={item.image}
            />
          ))}
        </div>
      </div>
    );
  };

  const data = [
    { month: 'Jan', value: 8900 },
    { month: 'Feb', value: 8000 },
    { month: 'Mar', value: 6000 },
    { month: 'Apr', value: 10000 },
    { month: 'May', value: 5000 },
    { month: 'Jun', value: 9000 },
    { month: 'Jul', value: 7500 },
    { month: 'Aug', value: 9000 },
    { month: 'Sep', value: 6750 },
    { month: 'Oct', value: 8700 },
    { month: 'Nov', value: 9200 },
    { month: 'Dec', value: 3000 },
  ];

  const [wajid, setWajid] = useState([]);
  const amounts = [3000, 2000, 3000, 1000];
  const [salesAgents, setSalesAgents] = useState([]);
  const [commissionAmounts, setCommissionAmounts] = useState([]);
  const [overallTotalCommission, setOverallTotalCommission] = useState(0);

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const contributionData = await fetch('https://crmapi.devcir.co/api/team_leaders');
        const campaignsData = await contributionData.json();
        setWajid(campaignsData);

        const matchedAgentsMap = {};
        const commissionMap = {};

        campaignsData.forEach(item => {
          const campaignId = item.campaign_detail ? item.campaign_detail.id : 0;
          console.log("Team Leader Campaign ID =", campaignId);

          matchedAgentsMap[campaignId] = [];
          commissionMap[campaignId] = 0;
        });

        const salesAgentsData = await fetch('https://crmapi.devcir.co/api/sales_agents');
        const salesAgentsList = await salesAgentsData.json();
        setSalesAgents(salesAgentsList);
        let totalCommission = 0;
        const individualCommissionAmounts = [];
        setOverallTotalCommission(totalCommission);
        setCommissionAmounts(individualCommissionAmounts);

      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchMyCampaigns();
  }, []);

  const performanceData = [
    { kpi: 'Revenue', target: 1000, actual: 900, percentToTarget: 40, commission: 100, gatekeeper: 'N/A', gatekeeperTarget: '-' },
    { kpi: 'Units', target: 500, actual: 400, percentToTarget: 70, commission: 50, gatekeeper: 'N/A', gatekeeperTarget: '-' },
    { kpi: 'Conversion', target: 200, actual: 180, percentToTarget: 105, commission: 20, gatekeeper: 'N/A', gatekeeperTarget: '-' },
    { kpi: 'Dials', target: 150, actual: 140, percentToTarget: 95, commission: 10, gatekeeper: 'N/A', gatekeeperTarget: '-' },
    { kpi: 'Productivity', target: 300, actual: 250, percentToTarget: 101, commission: 30, gatekeeper: 'N/A', gatekeeperTarget: '-' }
  ];

  const getPercentColor = (percent) => {
    if (percent == 50) return 'bg-[#FFF3F3]';
    if (percent == 70 || percent == 95) return 'bg-[#FFFDD4]';
    if (percent == 105 || percent == 101) return 'bg-[#F3FFF4]';
    if (percent >= 90) return 'bg-green-100 text-green-800';
    if (percent >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const contestants = [
    { name: 'Sarah Smith', level: 'Unicorn', points: 200, money: 150, avatar: '/images/dashboard_img1.png', badgeColor: '/images/unicorn.png' },
    { name: 'Anujaa Kumar', level: 'Platinum', points: 150, money: 100, avatar: '/images/dashboard_img2.png', badgeColor: '/images/platinium.png' },
    { name: 'Fernanda Celde', level: 'Gold', points: 75, money: 50, avatar: '/images/dashboard_img3.png', badgeColor: '/images/gold.png' },
  ];

  const leaderboardData = [
    { name: 'Fernando Celde', score: 75, image: '/images/dashboard_img3.png' },
    { name: 'Sarah Smith', score: 200, image: '/images/dashboard_img1.png' },
    { name: 'Pinaji Koarima', score: 74, image: '/images/dashboard_img1.png' },
    { name: 'Monaki Nahans', score: 50, image: '/images/dashboard_img3.png' },
    { name: 'Nualiri sjahej', score: 20, image: '/images/dashboard_img1.png' },
    { name: 'Tians jdife', score: 35, image: '/images/dashboard_img2.png' },
    { name: 'Nava Yaghnel', score: 60, image: '/images/dashboard_img2.png' },
    { name: 'Anujaa Kumar', score: 150, image: '/images/dashboard_img2.png' },
  ];

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeButton, setActiveButton] = useState('Month');
  const [showDetails, setShowDetails] = useState(false);

  const filteredData = selectedFilter == 'All' ? performanceData : performanceData.filter(row => row.kpi == selectedFilter);

  const handleButtonClick1 = (button) => {
    setActiveButton(button);
    setShowDetails(true);
  };

  const images = [
    '/images/coke.png', '/images/lipton.png', '/images/vodafone.png', '/images/brand.png'
  ];


  const [animateTable, setAnimateTable] = useState(false);

  // Trigger animation when selectedFilter changes
  useEffect(() => {
    setAnimateTable(true);
    const timer = setTimeout(() => {
      setAnimateTable(false); // Remove the animation class after the animation ends
    }, 500); // Match the animation duration

    return () => clearTimeout(timer); // Clean up the timer
  }, [selectedFilter]);


  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);


  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://crmapi.devcir.co/api/campaigns');
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        const data = await response.json();
        const fetchedTeams = data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );
        console.log('data', fetchedTeams)
        setCampaigns(fetchedTeams);
        if (fetchedTeams.length > 0) {
          setSelectedCampaignId(fetchedTeams[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCampaigns();
  }, []);



  return (
    <div className='mx-2'>
      <Navbar />
      <div className='flex gap-3'>
        <SideBar />
        <div className='w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4'>
          {/* <Current_Agent_Chart /> */}
          <div className='flex flex-col w-full gap-6 p-8 pb-12 card bg-[#009245]/5' >
            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B] '>My Commission</h1>
            <div className="flex w-full gap-4">

              <div className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl text-[#009245]">Total Commission</h2>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCaretUp} className="text-[#009245]" />
                    <span className="text-[#009245] text-xl font-semibold ml-2"> 2.5%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl font-semibold text-[#1E8675]">
                    ${overallTotalCommission.toFixed(2)}
                  </p>
                  <p className="text-sm text-[#5F5E5E]">vs $8750 last month</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    className={getButtonClasses('Current Month')}
                    onClick={() => {
                      handleButtonClick('Current Month')
                      console.log(`Current Month selected`)
                    }}
                  >
                    Current Month
                  </button>
                  <button
                    className={getButtonClasses('Quarter')}
                    onClick={() => {
                      handleButtonClick('Quarter')
                      console.log(`Quarter Month selected`)
                    }}
                  >
                    Quarter
                  </button>
                  <button
                    className={getButtonClasses('Year')}
                    onClick={() => {
                      handleButtonClick('Year')
                      console.log(`Year Month selected`)
                    }}
                  >
                    Year
                  </button>
                  <button
                    className={getButtonClasses('Custom')}
                    onClick={() => {
                      handleButtonClick('Custom')
                      console.log(`Custom Month selected`)
                    }}
                  >
                    Custom
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                <h2 className="text-xl text-[#009245] mb-6">Commission Contribution</h2>
                {/* <div className="flex items-center space-x-16 ml-3">
                  {wajid.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-[42px] h-[42px] rounded-full mb-2 overflow-hidden">
                        <img src={item.image_path} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-base text-[#1E8675] font-semibold">
                        ${commissionAmounts[index] !== undefined ? commissionAmounts[index].toFixed(2) : '0.00'}
                      </p>
                    </div>
                  ))}
                </div> */}

<div className="flex items-center space-x-16 ml-3">
  {wajid.map((item, index) => (
    <div key={index} className="flex flex-col items-center">
      <div className="w-[42px] h-[42px] rounded-full mb-2 overflow-hidden">
        <img
          src={item.image_path || fallbackImage} // Use fallbackImage if image_path is missing
          alt={item.name || "Default Image"}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-base text-[#1E8675] font-semibold">
        ${commissionAmounts[index] !== undefined ? commissionAmounts[index].toFixed(2) : '0.00'}
      </p>
    </div>
  ))}
</div>
              </div>


            </div>

            <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">

              <div className="flex justify-between items-center mb-2 relative">
                <h3 className="text-xl text-[#009245] font-semibold">Commission by month</h3>
                <div className="relative">
                  <button
                    className="text-[#072D20] border border-[#009245] rounded-lg px-4 py-2"
                    onClick={toggleDropdown}
                  >
                    {selectedYear}
                  </button>
                  {isOpen && (
                    <div
                      className="absolute z-10 mt-1 bg-white border border-[#009245] rounded-lg max-h-[50vh] overflow-y-auto"
                      onMouseLeave={() => setIsOpen(false)}
                    >
                      {years.map((year) => (
                        <div
                          key={year}
                          className="px-4 py-2 hover:bg-[#f0f0f0] cursor-pointer"
                          onClick={() => handleYearChange(year)}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ResponsiveContainer key={selectedYear} width="100%" height="86%">
                <BarChart data={data} margin={{ top: 20, left: 50, bottom: 5 }}>
                  <XAxis
                    dataKey="month"
                    axisLine={{ stroke: '#1E8675', strokeWidth: 2 }}
                    tickLine={false}
                  />
                  <YAxis
                    tickCount={6}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                    domain={[0, 12000]}
                    ticks={[2400, 4800, 7200, 9600, 12000]}
                  />
                  <Bar dataKey="value" fill="#1E8675" barSize={20}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      content={({ x, y, value }) => (
                        <g>
                          <rect
                            x={x - 12}
                            y={y - 30}
                            width={46}
                            height={20}
                            fill="#FFFFFF"
                            stroke="#E0E0E0"
                            strokeWidth={1}
                            rx={4}
                            ry={4}
                          />
                          <text
                            x={x + 8}
                            y={y - 16}
                            textAnchor="middle"
                            fill="#009245"
                            fontSize={12}
                            fontWeight="600"
                          >
                            ${value}
                          </text>
                        </g>
                      )}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* ___________________________________________________________________________________________________________ */}

          <div className='flex flex-col w-full gap-6 p-8 pb-12 card white'>
            <div className='flex flex-col'>
              <div className='flex justify-between items-center mb-4'>
                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Campaign Performance</h1>

                <div className='flex'>
                  <button className={`px-3 py-1 text-sm font-medium transform transition-all duration-500 ease-in-out ${selectedFilter == 'All' ? 'text-[#269F8B] shadow-xl scale-125 rotate-360' : 'text-[#ABABAB]'} border border-gray-300 bg-white rounded-lg`} onClick={() => setSelectedFilter('All')}>All</button>
                  <button className={`px-3 py-1 text-sm font-medium transform transition-all duration-500 ease-in-out ${selectedFilter == 'Revenue' ? 'text-[#269F8B] shadow-xl scale-125 rotate-360' : 'text-[#ABABAB]'}  border border-gray-300 bg-white rounded-lg`} onClick={() => setSelectedFilter('Revenue')}>Revenue</button>
                  <button className={`px-3 py-1 text-sm font-medium transform transition-all duration-500 ease-in-out ${selectedFilter == 'Units' ? 'text-[#269F8B] shadow-xl scale-125 rotate-360' : 'text-[#ABABAB]'}  border border-gray-300 bg-white rounded-lg`} onClick={() => setSelectedFilter('Units')}>Units</button>
                  <button className={`px-3 py-1 text-sm font-medium transform transition-all duration-500 ease-in-out ${selectedFilter == 'Conversion' ? 'text-[#269F8B] shadow-xl scale-125 rotate-360' : 'text-[#ABABAB]'} border border-gray-300 bg-white rounded-lg`} onClick={() => setSelectedFilter('Conversion')}>Conversion</button>
                  <button className={`px-3 py-1 text-sm font-medium transform transition-all duration-500 ease-in-out ${selectedFilter == 'Dials' ? 'text-[#269F8B] shadow-xl scale-125 rotate-360' : 'text-[#ABABAB]'} border border-gray-300 bg-white rounded-lg`} onClick={() => setSelectedFilter('Dials')}>Dials</button>
                  <button className={`px-3 py-1 text-sm font-medium transform transition-all duration-500 ease-in-out ${selectedFilter == 'Productivity' ? 'text-[#269F8B] shadow-xl scale-125 rotate-360' : 'text-[#ABABAB]'} border border-gray-300 bg-white rounded-lg`} onClick={() => setSelectedFilter('Productivity')}>Productivity</button>
                </div>

              </div>

<div className="flex justify-end">
    {isLoading ? (
      <div className="text-sm text-gray-500">Loading campaigns...</div>
    ) : error ? (
      <div className="text-sm text-red-500">{error}</div>
    ) : (
      campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="w-10 h-10 bg-cover bg-center rounded-full ml-2"
          style={{
            backgroundImage: `url(${campaign.image_path || fallbackImage})`,
            opacity: selectedCampaignId == campaign.id ? 1 : 0.5,
            cursor: 'pointer',
          }}
          onClick={() => setSelectedCampaignId(campaign.id)}
        />
      ))
    )}
  </div>

            </div>

            <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100'>
              <div className='p-6 '>
                <div className="relative w-full overflow-hidden">
                  <table className={`w-full ${animateTable ? 'animate-slideOutLeft' : 'animate-slideInRight'}`}>
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
                      {filteredData.map((row, index) => (
                        <tr key={index} className='text-sm'>
                          <td className='py-2 text-[#269F8B] font-medium'>{row.kpi}</td>
                          <td className='py-2 text-center'>{row.target}</td>
                          <td className='py-2 text-center'>{row.actual}</td>
                          <td className='py-2 text-center'>
                            <span className={`px-6 py-1 ${getPercentColor(row.percentToTarget)}`}>{row.percentToTarget}%</span>
                          </td>
                          <td className='py-2 text-center'>{row.commission}</td>
                          <td className={`px-6 py-1 text-center ${row.gatekeeper == 'N/A' ? 'bg-gray-100' : ''}`}>{row.gatekeeper}</td>
                          <td className={`px-6 py-1 text-center`}>
                            <span className={`inline-block ${row.gatekeeperTarget == '-' ? 'bg-gray-100 w-12' : ''}`}>{row.gatekeeperTarget}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>



          {/* _______________________________________________________________________________________________________________________ */}

          <div className='flex flex-col w-full gap-6 p-8 pb-12 card'>

            <div className='flex justify-between items-center mb-4'>
              <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Contest Summary</h1>
              <div className='flex space-x-2'>
                <button
                  className={`px-3 py-1 text-sm font-medium transform transition-all duration-500 ease-in-out 
                  ${activeButton == 'Week' ? 'text-[#269F8B] shadow-xl scale-125 rotate-360' : 'text-[#ABABAB]'} 
                  border border-gray-300 bg-white rounded-lg`}
                  onClick={() => handleButtonClick1('Week')}
                >
                  Week
                </button>

                <button
                  className={`px-6 py-1 text-sm font-medium transform transition-all duration-500 ease-in-out 
                  ${activeButton == 'Month' ? 'text-[#269F8B] shadow-xl scale-125 rotate-360' : 'text-[#ABABAB]'} 
                  border border-gray-300 bg-white rounded-lg`}
                  onClick={() => handleButtonClick1('Month')}
                >
                  Month
                </button>

                <button
                  className={`px-3 py-1 text-sm font-medium transform transition-all duration-500 ease-in-out 
                  ${activeButton == 'Year' ? 'text-[#269F8B] shadow-xl scale-125 rotate-360' : 'text-[#ABABAB]'} 
                  border border-gray-300 bg-white rounded-lg`}
                  onClick={() => handleButtonClick1('Year')}
                >
                  Year
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="w-full flex h-24 px-4 space-x-4 rounded-lg border-b-4 border-[#009245]/5">
                <div className="flex flex-row items-center pl-7 space-x-4 pr-10 border-r-4 border-[#009245]/5">
                  <img src='/images/medals.png' alt='Medal' className="w-[23px] h-[50.18px]" />
                  <p className="text-black text-[15px] font-normal">CONTESTS</p>
                  <h2 className="text-white bg-themeGreen px-4 py-[10px] rounded-xl text-xl font-semibold ">2</h2>
                </div>
                <div className="flex flex-row items-center pl-7 space-x-4 pr-14 border-r-4 border-[#009245]/5">
                  <img src='/images/stars.png' alt='Medal' className="w-[33px] h-[30.7px]" />
                  <p className="text-black text-[15px] font-normal">POINTS</p>
                  <h2 className="text-white bg-themeGreen px-4 py-[10px] rounded-xl text-xl font-semibold">200</h2>
                </div>
                <div className="flex flex-row items-center pl-7 space-x-4 pr-5 ">
                  <img src='/images/cashBag.png' alt='Medal' className="w-[33px] h-[41px]" />
                  <p className="text-black text-[15px] font-normal">TOTAL PRIZES</p>
                  <h2 className="text-white bg-themeGreen px-4 py-[10px] rounded-xl text-xl font-semibold">$150</h2>
                </div>
              </div>

              <div className="flex p-1">
                {prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="w-full p-4 flex items-center space-x-4 bg-white shadow-md"
                  >
                    <img src={prize.iconSrc} alt={prize.name} className="w-[39.2px] h-[30.36px]" />
                    <p className="text-[#000000] text-[11.76px] font-normal">{prize.name}</p>
                    <h2 className="bg-white shadow-lg p-2 text-[#269F8B] text-lg font-semibold shadow-[#00A46C26]">${prize.amount}</h2>
                  </div>
                ))}
              </div>

            </div>

            <div className="container mx-auto">

              <div className='flex justify-center  bg-white rounded-lg shadow-sm order-2 border-2 border-gray-100 py-8'>
                {contestants.map((contestant, index) => (
                  <div key={index} className='flex flex-col items-center mx-4'>
                    <div className='relative'>
                      <img src={contestant.avatar} alt={contestant.name} className='w-[133px] h-[133px] rounded-full' />
                      <div className='absolute top-20 bottom-0 left-20 w-[61px] h-[61px] rounded-full'>
                        <img src={contestant.badgeColor} alt='Badge' className='w-full h-full object-cover rounded-full' />
                      </div>
                    </div>
                    <p className='mt-2 text-lg font-medium text-[#009245]'>{contestant.name}</p>
                    <p className={`mt-1 text-base font-bold bg-clip-text text-transparent ${index == 0 ? 'bg-gradient-to-r from-[#1DD6FF] to-[#D21EFF]' : index == 1 ? 'bg-[#4F4F4F]' : 'bg-[#FFC700]'}`}>{contestant.level}</p>
                    <div className='flex items-center mt-1'>
                      <img src='images/star.png' alt='Star' className='w-6 h-6 mt-1' />
                      <span className='ml-1 text-base text-[#6A6A6A] font-medium'>{contestant.points} points</span>
                    </div>
                    <div className='flex items-center mt-1'>
                      <img src='images/bag.png' alt='Star' className='w-6 h-6 mt-1' />
                      <span className='ml-2 text-base text-[#6A6A6A] font-medium'>${contestant.money}</span>
                    </div>
                  </div>
                ))}
              </div>



              <div>
                <Leaderboard leaderboardData={leaderboardData} />
              </div>


            </div>
          </div>



          {/* ______________________________________________________________________________________________________ */}

        </div >
      </div >
    </div >

  )
}

export default Dashboard_manager;
