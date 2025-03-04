import React, { useState, useEffect } from 'react';
import fallbackImage from "/public/images/image_not_1.jfif";

const Intro = () => {

  const [commission, setCommission] = useState('');
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [badge, setBadge] = useState('/images/Badges/badge_bronze.png');
  const [badgeColor, setBadgeColor] = useState('linear-gradient(to right, #5f4114, #c67e3a)');
  const [borderColor, setBorderColor] = useState('#5f4114');
  const [data, setData] = useState({
    points: '',
    contests: '',
    timeStatsValue: '',
    monthStatsValue: '',
  });
  const [image, setImage] = useState(null);
  const defaultImage = fallbackImage;
  const [rank, setRank] = useState(0);

  useEffect(() => {
    const storedImage = localStorage.getItem("SalesAgent_Image");
    if (storedImage) {
      try {
        const imagePath = JSON.parse(storedImage);
        setImage(imagePath);
      } catch (error) {
        console.error("Error parsing image path:", error);
        setImage(defaultImage);
      }
    } else {
      setImage(defaultImage);
    }
  }, []);

  const tiers = [
    { name: 'Bronze', range: [0, 100], icon: '/images/Badges/badge_bronze.png', textColor: 'text-[#764f26]', color: 'bg-gradient-to-br from-[#5f4114] to-[#c67e3a]', borderColor: '#5f4114' },
    { name: 'Silver', range: [101, 300], icon: '/images/Badges/badge_silver.png', textColor: 'text-[#636363]', color: 'bg-gradient-to-br from-[#d0d0d0] to-[#4b4b4b]', borderColor: '#686868' },
    { name: 'Gold', range: [301, 500], icon: '/images/Badges/badge_gold.png', textColor: 'text-[#A35100]', color: 'bg-gradient-to-br from-[#ffdb6f] to-[#c77d19]', borderColor: '#f69c34' },
    { name: 'Platinum', range: [501, 700], icon: '/images/Badges/badge_platinium.png', textColor: 'text-[#5F5F5F]', color: 'bg-gradient-to-br from-[#aeaeae] to-[#696969]', borderColor: '#696969' },
    { name: 'Unicorn', range: [701, 1000], icon: '/images/Badges/badge_unicorn.png', textColor: 'text-blue-400', color: 'bg-gradient-to-br from-[#1DD6FF] to-[#D21EFF]', borderColor: '#5046e9' },
  ];

  const fetchLocal = () => {
    const loginName = localStorage.getItem('userFName');
    if (loginName) {
      setFullName(loginName);
      setFirstName(loginName.split(' ')[0]);
    }
    const commission_Agent = localStorage.getItem('commission_salesagent');
    let currentCommission = localStorage.getItem('CurrentCommission');
    let rankValue = localStorage.getItem('Rank');
    let lifeCommission = localStorage.getItem('LifeTimeCommission');


    const contest_data = localStorage.getItem('contestSummary');
    if (contest_data) {
      const parsedData = JSON.parse(contest_data);
      console.log("Contest ", parsedData)
      const points = parsedData.points || '';
      const total = parseFloat(parsedData.totalPrizes) + parseFloat(commission_Agent)
      console.log("Total", total)

      // Fetch CurrentCommission every second until a valid value is found
      const intervalId = setInterval(() => {
        currentCommission = localStorage.getItem('CurrentCommission');
        lifeCommission = localStorage.getItem('LifeTimeCommission');
        rankValue = localStorage.getItem('Rank');
        if (currentCommission && rankValue) {
          clearInterval(intervalId); // Stop fetching once a valid value is found
          setData({
            points: points,
            contests: parsedData.contests || '',
            timeStatsValue: parsedData.timeStats?.value || '',
            monthStatsValue: currentCommission,
          });
          setRank(rankValue);
          setCommission(lifeCommission);
        }
      }, 1000);

      // Update badge based on points
      const currentTier = tiers.find(
        (tier) => points >= tier.range[0] && points <= tier.range[1]
      );
      if (currentTier) {
        setBadge(currentTier.icon);
        setBadgeColor(currentTier.color)
        setBorderColor(currentTier.borderColor)
      }
    } else {
      setData({
        points: '',
        contests: '',
        timeStatsValue: '',
        monthStatsValue: '',
      });
    }
  };

  useEffect(() => {
    fetchLocal(); // Initial fetch of localStorage data

    const handleStorageChange = (event) => {
      if (event.key === 'contestSummary') {
        fetchLocal(); // Refetch when 'contestSummary' is updated in localStorage
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const stats = [
    { label: 'Points', value: `${data.points}`, icon: 'images/star.png', prefix: '' },
    { label: 'Commission', value: `${commission}`, icon: 'images/bag.png', prefix: '£' },
    { label: 'Contests', value: `${data.contests}`, icon: 'images/trophy.png', prefix: '£' },
    { label: 'Rank', value: `${rank}`, icon: 'images/prizee.png', prefix: '' },
    { label: 'Time', value: `${data.timeStatsValue}`, icon: 'images/time.png', suffix: 'years' },
    { label: 'This Month', value: `${data.monthStatsValue}`, icon: 'images/bag.png', prefix: '£' },
  ];

  return (

    <div className="w-full px-4 md:px-4 lg:px-4 mt-4 md:mt-8 flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col w-full gap-6 p-4 md:p-8 card rounded-xl bg-white shadow-sm">

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          <div className="flex-1 w-full">

            <h2 className="text-2xl md:text-4xl text-gray-600 mt-2 mb-4 md:mt-6 md:mb-6">
              <span className="font-bold">Good Morning</span>,
              <span className="text-gray-600 font-medium text-xl md:text-2xl ml-2">{firstName}</span>
            </h2>

            {/* Profile Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image Container */}
              <div className={`w-[120px] h-[120px] md:w-[160px] md:h-[160px] relative flex rounded-full ${badgeColor}`}>
                <img
                  src={image || defaultImage} 
                  alt="Profile"
                  className={`h-[95%] w-[95%] mx-auto my-auto rounded-full bg-white`}
                  onError={(e) => {
                    console.error("Error loading image");
                    e.target.src = defaultImage;
                  }}
                />
                {/* Badge */}
                <div className="absolute -right-4 top-3/4 transform -translate-y-1/2 w-[40px] h-[40px] md:w-[60px] md:h-[60px]">
                  <img
                    src={badge}
                    alt="Badge"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex flex-col items-center md:items-start md:ml-6">
                <p className="text-gray-500 text-lg md:text-xl mb-2">Negotiator</p>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-600">{fullName}</h3>
                <button
                  className={`mt-4 px-4 py-2 w-full md:w-2/3 rounded-xl text-white ${badgeColor}`}
                >
                  <p className="text-lg md:text-xl">{tiers.find(tier => data.points >= tier.range[0] && data.points <= tier.range[1])?.name || 'Unicorn'}</p>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full lg:w-auto mt-6 lg:mt-0">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm border-l-[3px] p-4 hover:shadow-md transition-shadow`}
                style={{ borderColor: borderColor }}
              >
                <div className="flex flex-col">
                  <span className="text-gray-400 text-base md:text-lg">{stat.label}</span>
                  <div className="flex items-center gap-2 mt-2 md:mt-4">
                    <img
                      src={stat.icon}
                      alt={stat.label}
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                    <span className="text-gray-800 text-lg md:text-xl font-normal">
                      {stat.prefix}{stat.value}
                      {stat.suffix && <span className="text-gray-500 ml-1">{stat.suffix}</span>}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>



        </div>

        {/* Tiers Section */}
        <div className="-mx-4 md:-mx-8 -mb-4 md:-mb-8 mt-8 md:mt-24">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center bg-gray-50 p-4 md:p-6 overflow-x-auto">
            {tiers.map((tier, index) => (
              <div key={index} className="flex flex-col items-center mx-2 md:mx-6 min-w-[100px]">
                {/* Tier Icon */}
                <div className="rounded-full mb-2 flex items-center justify-center">
                  <img
                    src={tier.icon}
                    alt={tier.name}
                    className="w-[35px] h-[35px] md:w-[45%] md:h-[45%] rounded-full object-cover"
                  />
                </div>
                {/* Tier Name */}
                <p className={`font-medium mb-1 text-sm md:text-base ${tier.textColor}`}>
                  {tier.name}
                </p>
                <p className={`font-medium mb-1 text-sm md:text-base ${tier.textColor}`}>
                  {`${tier.range[0]} - ${tier.range[1]}`}
                </p>
                {/* Tier Points */}
                <p className="text-xs text-gray-500">{tier.points}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;