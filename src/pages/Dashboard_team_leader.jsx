import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import './ManagerChart.css';

const TeamMember = ({ name, role, imageUrl, isLeader = false }) => (
    <div className="flex flex-col items-center">
        <div className={`w-16 h-16 mb-2 overflow-hidden border-2 ${isLeader ? 'border-blue-300' : 'border-red-500'} rounded-full`}>
            <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
        </div>
        <div className="text-center">
            <p className={`text-xs font-semibold ${isLeader ? 'text-red-500' : ''}`}>{role}</p>
            <p className="text-sm">{name}</p>
        </div>
    </div>
);

const OrgTree = ({ teamLeaderImage, salesAgents, teamleader }) => {
    const filteredAgents = salesAgents.filter(agent =>
        agent.campaign_details && agent.campaign_details.some(campaign => campaign.team_leader_id == 26)
    );

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex justify-between w-full mb-4">
                <h2 className="text-2xl text-[#269F8B] font-normal">My Team</h2>

<div className="space-y-4"> 
<div className="flex items-center space-x-14">
            <span className="text-[#1E8675] font-medium text-[14px]">Team Size :</span>
            <span className="text-[#7B7B7B] font-semibold text-[16px]">8 FTE</span>
          </div>
  
  <div className="flex items-center">
  <span className="text-[#1E8675] font-medium text-[14px]">Campaigns :</span>
    <div className="w-6 h-6 rounded-full ml-14 ">
      {teamleader && teamleader.campaign_detail ? (
        <img
          src={teamleader.campaign_detail.company_logo}
          alt={teamleader.campaign_detail.name}
          className="w-6 h-6 object-cover"
        />
      ) : " "}
    </div>
  </div>
</div>
            </div>
            <div className="flex flex-col items-center mb-8">
                <TeamMember
                    name="Terella kosde"
                    role="TEAM LEADER"
                    imageUrl={teamLeaderImage} 
                    isLeader={true}
                />
                <div className="w-[2px] h-16 bg-[#71C8BA] my-4"></div>
            </div>

            {/* <div className="grid grid-cols-6 gap-2 justify-center w-full">
                {filteredAgents.map(agent => (
                    <TeamMember
                        key={agent.id} 
                        name={agent.name}
                        role={<span className="text-red-500">Sales Agent</span>}
                        imageUrl={agent.image_path || "images/dashboard_img1.png"} 
                    />
                ))}
            </div> */}

<div className="w-full flex justify-center">
    <div className="grid grid-cols-5 gap-10">
        {filteredAgents.map(agent => (
            <TeamMember
                key={agent.id} 
                name={agent.name}
                role={<span className="text-red-500">Sales Agent</span>}
                imageUrl={agent.image_path} 
            />
        ))}
    </div>
</div>

        </div>
    );
};


const Dashboard_TeamLeader = () => {
    const [teamLeaderImage, setTeamLeaderImage] = useState('');
    const [salesAgents, setSalesAgents] = useState([]);
    const [teamLeader, setTeamLeader] = useState([]);
    const [totalCommission, setTotalCommission] = useState(0);

    useEffect(() => {
        const fetchTeamLeader = async () => {
            try {
                const response = await fetch('https://crmapi.devcir.co/api/team_leaders/26');
                const data = await response.json();
                setTeamLeader(data);
            } catch (error) {
                console.error('Error fetching Sales Agents:', error);
            }
        };

        fetchTeamLeader();
    }, []);


    useEffect(() => {
        const fetchSalesAgents = async () => {
            try {
                const response = await fetch('https://crmapi.devcir.co/api/sales_agents');
                const salesAgents = await response.json();
                setSalesAgents(salesAgents); 

                const fetchTeamLeader = async () => {
                    try {
                        const leaderResponse = await fetch('https://crmapi.devcir.co/api/team_leader_by_id/26');
                        const teamLeader = await leaderResponse.json();
                        const teamLeaderImagePath = teamLeader.image_path;
                        setTeamLeaderImage(teamLeaderImagePath); 

                        let commissionSum = 0; // Initialize total commission

                        salesAgents.forEach(agent => {
                            if (agent.campaign_details && agent.campaign_details.length > 0) {
                                agent.campaign_details.forEach(campaign => {
                                    if (campaign.team_leader_id == 26) {
                                        console.log('Matched Sales Agent:', agent.name);
                                        // Add the agent's commission to commissionSum
                                        commissionSum += Number(agent.commission) || 0; // Ensure it's a number
                                    }
                                });
                            }
                        });

                        // Set the total commission state
                        setTotalCommission(commissionSum);
                        // Print the total commission for matched agents
                        console.log('Total Commission for Team Leader ID 26:', commissionSum.toFixed(2)); // Print total commission

                    } catch (error) {
                        console.error('Error fetching team leader:', error);
                    }
                };

                fetchTeamLeader();
            } catch (error) {
                console.error('Error fetching sales agents:', error);
            }
        };

        fetchSalesAgents();
    }, []);

    // mmmmm

    const [selectedButton, setSelectedButton] = useState('Current Month');

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    const getButtonClasses = (buttonName) =>
        buttonName == selectedButton
            ? 'px-4 py-1 border-2 border-[#1E8675] text-[#009245] rounded-lg text-xs'
            : 'px-4 py-1 border-2 border-[#E5E5E5] text-[#072D20] rounded-lg text-xs';


    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [isOpen, setIsOpen] = useState(false);

    const years = Array.from({ length: 101 }, (_, i) => currentYear - i);

    const handleYearChange = (year) => {
        setSelectedYear(year);
        console.log(`Year Selected: `, year);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };


    const prizes = [
        { name: 'Cash', amount: 200, iconSrc: '/images/cash.png' },
        { name: 'Vouchers', amount: 300, iconSrc: '/images/voucher.png' },
        { name: 'Food', amount: 150, iconSrc: '/images/food.png' },
        { name: 'Experiences', amount: 100, iconSrc: '/images/experience.png' }
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

                <div className="relative w-16 h-16 rounded-full ml-8">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />


                    <img
                        src={badge}
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
                                width: `${Math.min((score / (score + 1000)) * 100, 100)}%`,
                                background: 'linear-gradient(90deg, #1A7465 0%, #2DDAB9 100%)',
                            }}
                        ></div>
                        <div
                            className="absolute font-bold bg-white text-[#009245] text-xs rounded px-4 py-1"
                            style={{
                                top: '-6px',
                                left: `calc(${Math.min((score / (score + 1000)) * 100, 100)}% - 20px)`,
                                zIndex: 10,
                            }}
                        >
                            {score}
                        </div>
                        <div
                            className="absolute top-0 h-3 bg-transparent"
                            style={{
                                left: `${Math.min((score / (score + 1000)) * 100, 100)}%`,
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
        { month: 'Jan', value: 2400 },
        { month: 'Feb', value: 2200 },
        { month: 'Mar', value: 1800 },
        { month: 'Apr', value: 2500 },
        { month: 'May', value: 1400 },
        { month: 'Jun', value: 2300 },
        { month: 'Jul', value: 2050 },
        { month: 'Aug', value: 2180 },
        { month: 'Sep', value: 2020 },
        { month: 'Oct', value: 2090 },
        { month: 'Nov', value: 2098 },
        { month: 'Dec', value: 990 },
    ];

    const contributionData = [
        { name: 'Coca-Cola', amount: 3000, image: '/images/coke.png' },
        // { name: 'Lipton', amount: 3000, image: '/images/lipton.png' },
        // { name: 'Vodafone', amount: 2000, image: '/images/coke.png' },
        // { name: '3', amount: 1000, image: '/images/lipton.png' },
    ];

    const performanceData = [
        { kpi: 'Revenue', target: 80000, actual: 40000, percentToTarget: 50, commission: 250, gatekeeper: 'YES', gatekeeperTarget: '60%' },
        { kpi: 'Units', target: 400, actual: 250, percentToTarget: 70, commission: 140, gatekeeper: 'N/A', gatekeeperTarget: '-' },
        { kpi: 'Conversion', target: 20, actual: 21, percentToTarget: 105, commission: 210, gatekeeper: 'N/A', gatekeeperTarget: '-' },
        { kpi: 'Dials', target: 200, actual: 190, percentToTarget: 95, commission: 47, gatekeeper: 'N/A', gatekeeperTarget: '-' },
        { kpi: 'Productivity', target: 75, actual: 76, percentToTarget: 101, commission: 50, gatekeeper: 'N/A', gatekeeperTarget: '-' }
    ];

    const getPercentColor = (percent) => {
        if (percent == 50) return 'bg-[#FFF3F3]';
        if (percent == 70 || percent == 95) return 'bg-[#FFFDD4]';
        if (percent == 105 || percent == 101) return 'bg-[#F3FFF4]';
        if (percent >= 90) return 'bg-green-100 text-green-800';
        if (percent >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const CustomYAxisTick = ({ x, y, payload }) => {
        return (
            <text
                x={x - 20}
                y={y + 16}
                dy={3}
                textAnchor="end"
                fill="black"
                fontSize={14}
            >
                ${payload.value}
            </text>
        );
    };


    const leaderboardData = [
        { name: 'Fernando Celde', score: 450, image: '/images/dashboard_img3.png' },
        { name: 'Sarah Smith', score: 488, image: '/images/dashboard_img1.png' },
        { name: 'Pinaji Koarima', score: 450, image: '/images/dashboard_img1.png' },
        { name: 'Monaki Nahans', score: 400, image: '/images/dashboard_img3.png' },
        { name: 'Nualiri sjahej', score: 1000, image: '/images/dashboard_img1.png' },
        { name: 'Tians jdife', score: 2000, image: '/images/dashboard_img2.png' },
        { name: 'Nava Yaghnel', score: 3300, image: '/images/dashboard_img2.png' },
        { name: 'Anujaa Kumar', score: 290, image: '/images/dashboard_img2.png' },
    ];

    const sortedContestants = leaderboardData.sort((a, b) => b.score - a.score).slice(0, 3);

    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeButton, setActiveButton] = useState('Month');
    const [showDetails, setShowDetails] = useState(false);

    const filteredData = selectedFilter == 'All' ? performanceData : performanceData.filter(row => row.kpi == selectedFilter);

    const handleButtonClick1 = (button) => {
        setActiveButton(button);
        setShowDetails(true);
    };



    // Contest Summary API
    const images = [
        '/images/coke.png'
    ];



    return (
        <div className='mx-2'>
            <Navbar />
            <div className='flex gap-3'>
                <SideBar />
                <div className='w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4'>
                    <div className='flex flex-col w-full gap-6 p-8 pb-12 card white'>
                        <OrgTree teamLeaderImage={teamLeaderImage} salesAgents={salesAgents} teamleader={teamLeader} />
                    </div>

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
                                    <p className="text-2xl font-semibold text-[#1E8675]">${totalCommission.toFixed(2)}</p>
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
                <div className="flex items-center justify-center space-x-16 ml-3">
                    <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full mb-2 overflow-hidden">
                            {teamLeader && teamLeader.campaign_detail ? (
                                <img
                                    src={teamLeader.campaign_detail.company_logo}
                                    alt={teamLeader.campaign_detail.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : " "}
                        </div>
                        <p className="text-base text-[#1E8675] font-semibold">${totalCommission.toFixed(2)}</p> 
                    </div>
                </div>
            </div>
                        </div>

                        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">

                            <div className="flex justify-between items-center mb-2 relative">
                                <h3 className="text-xl text-[#009245] font-semibold">Commission by month</h3>
                                <div className="relative">
                                    <button
                                        className="text-[#072D20] border border-[#009245] rounded-lg px-4 py-2"
                                        onClick={toggleDropdown} // Open/close dropdown on button click
                                    >
                                        {selectedYear}
                                    </button>
                                    {isOpen && (
                                        <div
                                            className="absolute z-10 mt-1 bg-white border border-[#009245] rounded-lg max-h-[50vh] overflow-y-auto"
                                            onMouseLeave={() => setIsOpen(false)} // Close dropdown when mouse leaves
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
                                        domain={[0, 3000]}
                                        ticks={[3000, 2500, 2000, 1500, 1000, 500]}
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
                                    <div
                                        className='w-10 h-10 bg-cover bg-center rounded-full ml-2'
                                        style={{
                                            backgroundImage: teamLeader && teamLeader.campaign_detail
                                                ? `url(${teamLeader.campaign_detail.company_logo})`
                                                : " ",
                                            // opacity: selectedImage == image ? 1 : 0.5,
                                            cursor: 'pointer'
                                        }}
                                    // onClick={() => setSelectedImage(image)}
                                    />
                                </div>
                            </div>

                            <div className='flex justify-end'>
                                {/* {images.map((image, index) => ( */}
                                {/* <div
                                        // key={index}
                                        className='w-10 h-10 bg-cover bg-center rounded-full ml-2'
                                        style={{
                                            backgroundImage: teamLeader && teamLeader.campaign_detail 
                                            ? `url(${teamLeader.campaign_detail.company_logo})` 
                                            : " " ,
                                            // opacity: selectedImage == image ? 1 : 0.5,
                                            cursor: 'pointer'
                                        }}
                                        // onClick={() => setSelectedImage(image)}
                                    /> */}
                                {/* ))} */}




                                {/* {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className='w-10 h-10 bg-cover bg-center rounded-full ml-2'
                                        style={{
                                            backgroundImage: `url(${image})`,
                                            opacity: selectedImage == image ? 1 : 0.5,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelectedImage(image)}
                                    />
                                ))} */}
                            </div>

                        </div>

                        <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100'>
                            <div className='p-6'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='text-left text-sm font-medium text-gray-500'>
                                            <th className='pb-2 text-[#269F8B] '>KPIs</th>
                                            <th className='pb-2 text-[#269F8B] text-center '>Target</th>
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
                                                <td className='py-2 text-[#269F8B] font-medium '>{row.kpi}</td>
                                                <td className='py-2 text-center'>{row.target}</td>
                                                <td className='py-2 text-center'>{row.actual}</td>
                                                <td className='py-2 text-center'>
                                                    <span className={`px-6 py-1  ${getPercentColor(row.percentToTarget)}`}>{row.percentToTarget}%</span>
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
                                    <h2 className="text-white bg-themeGreen px-4 py-[10px] rounded-xl text-xl font-semibold ">5</h2>
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
                                {sortedContestants.map((contestant, index) => {
                                    let level, money, badgeColor;
                                    if (index == 0) {
                                        level = 'Unicorn';
                                        money = 500;
                                        badgeColor = '/images/unicorn.png';
                                    } else if (index == 1) {
                                        level = 'Platinum';
                                        money = 277;
                                        badgeColor = '/images/platinium.png';
                                    } else if (index == 2) {
                                        level = 'Gold';
                                        money = 200;
                                        badgeColor = '/images/gold.png';
                                    }

                                    return (
                                        <div key={index} className='flex flex-col items-center mx-4'>
                                            <div className='relative'>
                                                <img src={contestant.image} alt={contestant.name} className='w-[133px] h-[133px] rounded-full' />
                                                <div className='absolute top-20 bottom-0 left-20 w-[61px] h-[61px] rounded-full'>
                                                    <img src={badgeColor} alt='Badge' className='w-full h-full object-cover rounded-full' />
                                                </div>
                                            </div>
                                            <p className='mt-2 text-lg font-medium text-[#009245]'>{contestant.name}</p>
                                            <p className={`mt-1 text-base font-bold bg-clip-text text-transparent ${index == 0 ? 'bg-gradient-to-r from-[#1DD6FF] to-[#D21EFF]' : index == 1 ? 'bg-[#4F4F4F]' : 'bg-[#FFC700]'}`}>
                                                {level}
                                            </p>
                                            <div className='flex items-center mt-1'>
                                                <img src='images/star.png' alt='Star' className='w-6 h-6 mt-1' />
                                                <span className='ml-1 text-base text-[#6A6A6A] font-medium'>{contestant.score} points</span>
                                            </div>
                                            <div className='flex items-center mt-1'>
                                                <img src='images/bag.png' alt='Bag' className='w-6 h-6 mt-1' />
                                                <span className='ml-2 text-base text-[#6A6A6A] font-medium'>${money}</span>
                                            </div>
                                        </div>
                                    );
                                })}
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


export default Dashboard_TeamLeader