import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

const Actual_Vs_Target_logic = (barIndex) => {
  const [chartData, setChartData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [allAgentsPerformance, setAllAgensPerformance] = useState(JSON.parse(localStorage.getItem('Performace Table')));
  const [agentsTarget, setAgentsTarget] = useState(localStorage.getItem('TotalTargetAgents')?.split(',') || []);
  const [agentMonth, setAgentMonth] = useState(JSON.parse(localStorage.getItem('Agents_KPI_Data')));

  const initialData = [
    { month: "Jan", target: 10000, actual: 12000 },
    { month: "Feb", target: 9000, actual: 9000 },
    { month: "Mar", target: 11000, actual: 16000 },
    { month: "Apr", target: 8000, actual: 8000 },
    { month: "May", target: 14000, actual: 9000 },
    { month: "June", target: 9000, actual: 9000 },
    { month: "July", target: 15000, actual: 15000 },
    { month: "Aug", target: 10000, actual: 10000 },
    { month: "Sep", target: 13000, actual: 13000 },
    { month: "Oct", target: 5000, actual: 5000 },
    { month: "Nov", target: 11000, actual: 11000 },
    { month: "Dec", target: 8000, actual: 8000 },
  ];

  const monthAbbreviations = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "June",
    July: "July",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  };

  useEffect(() => {
    const currentMonthIndex = initialData.findIndex(data => data.month === monthAbbreviations[agentMonth.month]);

    const updatedInitialData = initialData
      .filter((_, index) => index <= currentMonthIndex) // Only include data up to the current month
      .map((data, index) => {
        if (data.month === monthAbbreviations[agentMonth.month]) {
          return { ...data, target: allAgentsPerformance[barIndex.barIndex].target, actual: allAgentsPerformance[barIndex.barIndex]?.actual };
        }
        return data;
      });

    localStorage.setItem('charts', JSON.stringify(updatedInitialData));
    setChartData(updatedInitialData);

    const currentYear = new Date().getFullYear();
    const generatedYears = Array.from(
      { length: 10 },
      (_, i) => currentYear + i
    );
    setYears(generatedYears);

    const handleStorageChange = (e) => {
      if (e.key === 'charts') {
        setChartData(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'TotalTargetAgents' || event.key === 'TeamLeader Actual' || event.key === 'Agents_KPI_Data') {
        setAllAgensPerformance(JSON.parse(localStorage.getItem('TeamLeader Actual')));
        setAgentsTarget(localStorage.getItem('TotalTargetAgents')?.split(',') || []);
        setAgentMonth(JSON.parse(localStorage.getItem('Agents_KPI_Data')));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const formatYAxis = (value) => {
    if (value === 0) return `${barIndex.barIndex === 8 || barIndex.barIndex === 10 ? ' £' : ''}0`;
    if (value >= 1000) {
      return `${barIndex.barIndex === 8 || barIndex.barIndex === 10 ? ' £' : ''}${value / 1000}K`;
    }
    return `${barIndex.barIndex === 8 || barIndex.barIndex === 10 ? ' £' : ''}${value}`;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  const CustomizedDot = (props) => {
    const { cx, cy, value, target } = props;
    if (value > target) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={6} fill="#22D3EE" stroke="#22D3EE" />
          <text
            x={cx}
            y={cy - 15}
            textAnchor="middle"
            fill="#059669"
            fontSize={12}
          >
            {barIndex.barIndex === 8 || barIndex.barIndex === 10 ? `£` : ''}
            {value < 1000 ? `${value}` : `${value / 1000}K`}
          </text>
        </g>
      );
    }
    return <circle cx={cx} cy={cy} r={6} fill="#22D3EE" stroke="#22D3EE" />;
  };

  return (
    <div className="w-full p-4 rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-2 relative">
        <h3 className="text-xl text-[#009245]">Actual vs Target</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#009245]"></div>
            <span className="text-sm text-[#072D20]">Target</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#00EFD8]"></div>
            <span className="text-sm text-[#072D20]">Actual</span>
          </div>
          <div className="relative z-10">
            <button
              className="flex items-center text-lg text-[#072D20] border-[#009245]"
              onClick={toggleDropdown}
            >
              {selectedYear}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full w-[180%] right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-md max-h-40 overflow-y-auto z-50">
                {years.map((year) => (
                  <div
                    key={year}
                    className="px-4 py-2 text-sm text-[#072D20] text-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ComposedChart
        width={950}
        height={300}
        data={chartData}
        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#666" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#666" }}
          tickFormatter={formatYAxis}
        />
        <Tooltip
          formatter={(value) => `${(barIndex.barIndex === 8 || barIndex.barIndex === 10) ? ' £' : ''}${value.toLocaleString()}`}
          contentStyle={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
        <Bar
          dataKey="target"
          fill="#059669"
          radius={[4, 4, 0, 0]}
          barSize={24}
        >
          <LabelList
            dataKey="target"
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
                  {barIndex.barIndex === 8 || barIndex.barIndex === 10 ? `£` : ''}
                  {value < 1000 ? `${value}` : `${value / 1000}K`}
                </text>
              </g>
            )}
          />
        </Bar>
        <Line
          type="linear"
          dataKey="actual"
          stroke="#22D3EE"
          strokeWidth={3}
          dot={<CustomizedDot />}
          activeDot={{ r: 8 }}
        />
      </ComposedChart>
    </div>
  );
};

export default Actual_Vs_Target_logic;