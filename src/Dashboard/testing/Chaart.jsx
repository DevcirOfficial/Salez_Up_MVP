import React, { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChevronDown } from "lucide-react";

// Initial data
const initialData = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 2200 },
  { month: "Mar", amount: 1800 },
  { month: "Apr", amount: 2500 },
  { month: "May", amount: 1400 },
  { month: "Jun", amount: 2300 },
  { month: "Jul", amount: 2050 },
  { month: "Aug", amount: 2180 },
  { month: "Sep", amount: 2020 },
  { month: "Oct", amount: 2090 },
  { month: "Nov", amount: 2098 },
  { month: "Dec", amount:2000 },
];

// Month mapping for conversion
const monthMapping = {
  'january': 'Jan',
  'february': 'Feb',
  'march': 'Mar',
  'april': 'Apr',
  'may': 'May',
  'june': 'Jun',
  'july': 'Jul',
  'august': 'Aug',
  'september': 'Sep',
  'october': 'Oct',
  'november': 'Nov',
  'december': 'Dec'
};

const CustomBarLabel = ({ x, y, width, value }) => {
  return (
    <text
      x={x + width / 2}
      y={y - 10}
      fill="#4aa77c" 
      textAnchor="middle"
      fontSize={14}
      fontWeight={500}
      stroke="white"
      strokeWidth={2}
      paintOrder="stroke"
      filter="url(#shadow)"
    >
      ${value}
    </text>
  );
};

const Chart = () => {
  const [commissionMonth, setCommissionMonth] = useState('');
  const [commissionValue, setCommissionValue] = useState('');
  const [chartData, setChartData] = useState([]);
  const [userMonth, setUserMonth] = useState(JSON.parse(localStorage.getItem("Agents_KPI_Data")));

  useEffect(() => {
    const fetchData = () => {
      const userMonth = JSON.parse(localStorage.getItem("Agents_KPI_Data"));
      if (userMonth) {
        const month = userMonth.month ? userMonth.month.replace(/^"|"$/g, '') : '';
        const value = userMonth.opportunity ? userMonth.opportunity.replace(/^"|"$/g, '') : '';

        // Fetch data from localStorage
        const storedData = JSON.parse(localStorage.getItem("Monthly Commission")) || initialData;
        setChartData(storedData);

        setCommissionMonth(month);
        setCommissionValue(value);

        if (month && value) {
          const formattedMonth = monthMapping[month.toLowerCase()];

          if (formattedMonth) {
            const updatedData = storedData.map((item, index) => {
              if (item.month === formattedMonth) {
                return { ...item, amount: parseFloat(value) };
              } else if (index > storedData.findIndex(i => i.month === formattedMonth)) {
                return null;
              }
              return item;
            }).filter(item => item !== null);
            console.log("DATA => ", updatedData)
            setChartData(updatedData);
          }
        }
      } else {
        // Retry fetching data after a short delay if not available
        setTimeout(fetchData, 1000); // Check again after 1 second
      }
    };

    fetchData(); // Initial call to fetch data
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
        if (event.key === 'Agents_KPI_Data') {
            setUserMonth(JSON.parse(localStorage.getItem("Agents_KPI_Data")));
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
}, []);

  return (
    <div className="w-full p-6 bg-white rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#059669] text-xl font-semibold">Commission by month</h2>
        <div className="relative">
          <select className="py-1 pl-3 pr-8 text-sm bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
          </select>
          <ChevronDown className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 pointer-events-none right-2 top-1/2" />
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              vertical={false} 
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              tickLine={false}
              tick={{ 
                fill: "#4b5563", 
                fontSize: 14,
                fontWeight: 500
              }}
              padding={{ left: 10, right: 10 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: "#4b5563", 
                fontSize: 16,
                fontWeight: 500
              }}
              tickFormatter={(value) => `$${value}`}
              domain={[0, 3000]}
              ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
            />
            <Bar
              dataKey="amount"
              fill="#059669"
              radius={[4, 4, 0, 0]}
              barSize={28}
              label={<CustomBarLabel />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;