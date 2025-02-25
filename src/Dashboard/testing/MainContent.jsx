import React, { useState, useEffect } from 'react';
import Actual_page from '../../pages/Actual_page';
import SalesAgent_ActualPage from '../../pages/SalesAgent_ActualPage';
import EditableChartTable from './EditableChartTable';


const MainContent = ({ activeSection }) => {

  const [summary, setSummary] = useState(() => {


    const savedSummary = localStorage.getItem('contestSummary');
    if (savedSummary) {
      return JSON.parse(savedSummary);
    }
    return {
      contests: 2,
      points: 200,
      totalPrizes: 150,
      prizes: [
        { name: 'Cash', amount: 50, iconSrc: '/images/cash.png' },
        { name: 'Vouchers', amount: 50, iconSrc: '/images/voucher.png' },
        { name: 'Food', amount: 50, iconSrc: '/images/food.png' },
        { name: 'Experiences', amount: 0, iconSrc: '/images/experience.png' }
      ],
      timeStats: {
        icon: 'images/time.png',
        label: 'Time',
        value: 2
      },
      monthStats: {
        icon: 'images/bag.png',
        label: 'This Month',
        value: 200
      }
    };
  });

  useEffect(() => {
    const summaryJSON = {
      time: summary.timeStats.value,
      thisMonth: summary.monthStats.value,
      contests: summary.contests,
      points: summary.points,
      totalPrizes: summary.totalPrizes,
      prizes: {
        cash: summary.prizes[0].amount,
        vouchers: summary.prizes[1].amount,
        food: summary.prizes[2].amount,
        experiences: summary.prizes[3].amount
      }
    };
    localStorage.setItem('contestSummary', JSON.stringify(summary));
  }, [summary]);


  useEffect(() => {
    const total = summary.prizes.reduce((sum, prize) => sum + prize.amount, 0);
    setSummary(prev => ({ ...prev, totalPrizes: total }));
  }, [summary.prizes]);


  const handlePrizeChange = (index, amount) => {
    const newPrizes = [...summary.prizes];
    newPrizes[index] = { ...newPrizes[index], amount: Number(amount) };
    setSummary(prev => ({ ...prev, prizes: newPrizes }));
  };

  const handleMainStatChange = (key, value) => {
    if (key !== 'totalPrizes') {
      setSummary(prev => ({ ...prev, [key]: Number(value) }));
    }
  };


  const handleTimeStatsChange = (value) => {
    setSummary(prev => ({
      ...prev,
      timeStats: { ...prev.timeStats, value: Number(value) }
    }));
  };

  const handleMonthStatsChange = (value) => {
    setSummary(prev => ({
      ...prev,
      monthStats: { ...prev.monthStats, value: Number(value) }
    }));
  };


  const mainStats = [
    {
      icon: '/images/medals.png',
      label: 'CONTESTS',
      value: summary.contests,
      hasRightBorder: true,
      onChange: (value) => handleMainStatChange('contests', value),
      editable: true
    },
    {
      icon: '/images/stars.png',
      label: 'POINTS',
      value: summary.points,
      hasRightBorder: true,
      onChange: (value) => handleMainStatChange('points', value),
      editable: true
    },
    {
      icon: '/images/cashBag.png',
      label: 'TOTAL PRIZES',
      value: `$${summary.totalPrizes}`,
      hasRightBorder: false,
      editable: false
    }
  ];


  const EditableStatCard = ({ icon, label, value, hasRightBorder, onChange, editable }) => (
    <div className={`flex flex-row items-center px-8 p-4 space-x-14  shadow-xl ${hasRightBorder ? 'border-r-4 border-[#009245]/5 shadow-xl' : ''}`}>
      <img src={icon} alt={label} className="w-[33px] h-[41px] object-contain" />
      <p className="text-black text-[15px] font-normal">{label}</p>
      {editable ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-white bg-themeGreen text-center px-4 py-[10px] rounded-xl text-xl font-semibold w-24"
        />
      ) : (
        <div className="text-white bg-themeGreen px-4 py-[10px] rounded-xl text-xl font-semibold">
          {value}
        </div>
      )}
    </div>
  );

  const EditableTimeStats = () => (
    <div className="flex h-24 items-center mx-auto justify-between w-[70%] px-4 space-x-32 rounded-lg bg-transparent mb-6">
      <div className="flex flex-row items-center rounded-xl px-8  p-4 space-x-8 border-r-4 border-[#009245]/5 shadow-xl">
        <img src={summary.timeStats.icon} alt="Time" className="w-[48px] h-[50.18px]" />
        <p className="text-black text-[15px] font-normal">{summary.timeStats.label}</p>
        <input
          type="number"
          value={summary.timeStats.value}
          onChange={(e) => handleTimeStatsChange(e.target.value)}
          className="text-white bg-themeGreen text-center  py-[10px] rounded-xl text-xl font-semibold w-24"
        />
      </div>
      <div className="flex flex-row items-center rounded-xl px-8 p-4 space-x-14 border-r-4 border-[#009245]/5 shadow-xl">
        <img src={summary.monthStats.icon} alt="Month" className="w-[33px] h-[30.7px]" />
        <p className="text-black text-[15px] font-normal">{summary.monthStats.label}</p>
        <input
          type="number"
          value={summary.monthStats.value}
          onChange={(e) => handleMonthStatsChange(e.target.value)}
          className="text-white bg-themeGreen text-center px-4 py-[10px] rounded-xl text-xl font-semibold w-24"
        />
      </div>
    </div>
  );

  const [actualValue, setActualValue] = useState(
    localStorage.getItem('forecast_commission')
      ? JSON.parse(localStorage.getItem('forecast_commission')).actualValue
      : "100"
  );
  const [targetValue, setTargetValue] = useState(
    localStorage.getItem('forecast_commission')
      ? JSON.parse(localStorage.getItem('forecast_commission')).targetValue
      : "100"
  );

  const updateLocalStorage = (newActualValue, newTargetValue) => {
    const data = {
      actualValue: newActualValue,
      targetValue: newTargetValue,
    };
    localStorage.setItem('forecast_commission', JSON.stringify(data));
  };

  const handleActualValueChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setActualValue(value);
      updateLocalStorage(value, targetValue);
    }
  };


  const handleTargetValueChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setTargetValue(value);
      updateLocalStorage(actualValue, value);
    }
  };


  const renderContent = () => {
    switch (activeSection) {
      case 'contests':
        return (

          <div className="bg-white  rounded-xl">
            <h2 className="text-3xl font-semibold mb-6 text-[#1d8675]">Contest Summary</h2>

            <EditableTimeStats />

            <div className="flex h-24 px-4 space-x-10 rounded-lg bg-transparent mb-6">
              {mainStats.map((stat, index) => (
                <EditableStatCard key={index} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {summary.prizes.map((prize, index) => (
                <div
                  key={index}
                  className="px-8 p-4 flex items-center justify-between bg-white rounded-lg shadow-xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center  space-x-3">
                    <img src={prize.iconSrc} alt={prize.name} className="w-[39.2px] h-[32px]" />
                    <p className="text-[#000000] text-sm font-normal">{prize.name}</p>
                  </div>
                  <input
                    type="number"
                    value={prize.amount}
                    onChange={(e) => handlePrizeChange(index, e.target.value)}
                    className="bg-white shadow-lg text-center  ml-12 text-[#269F8B] text-lg font-semibold shadow-[#00A46C26] rounded w-24"
                  />
                </div>
              ))}
            </div>
          </div>

        );





      case 'forecast':
        return (

          <div className="bg-gray-100 max-w-3xl mx-auto p-4 rounded-xl mt-24">
            <h1 className='text-[#269F8B] text-2xl font-semibold text-center mt-6'>Forecast Commission</h1>
            <div className="grid grid-cols-2 gap-10 justify-center mt-20">
              <div className="p-4 flex flex-col items-start bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="text-[#000000] text-xl font-normal mb-2">Actual Value</p>
                <input
                  type="number"
                  value={actualValue}
                  onChange={handleActualValueChange}
                  className="bg-white shadow-lg p-2 text-[#269F8B] text-lg font-semibold shadow-[#00A46C26] rounded w-full"
                />
              </div>
              <div className="p-4 flex flex-col items-start bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="text-[#000000] text-xl font-normal mb-2">Target Value</p>
                <input
                  type="number"
                  value={targetValue}
                  onChange={handleTargetValueChange}
                  className="bg-white shadow-lg p-2 text-[#269F8B] text-lg font-semibold shadow-[#00A46C26] rounded w-full"
                />
              </div>
            </div>
          </div>


        );

      case 'actual':
        return (
          <Actual_page />
        )



      case 'target vs actual barchart':
        return (
          <EditableChartTable />
        )


      case 'All Agents Actual':
        return (
          <SalesAgent_ActualPage />
        )


      default:
        return null;
    }
  };

  return (
    <div className="w-full content-fit ">
      <button className="mb-6">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      {renderContent()}
    </div>
  );
};

export default MainContent;