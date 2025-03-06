import React, { useState, useEffect, useRef } from "react";
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
import PoundSymbol from "../../components/PoundSymbol"; // Keep the import

const Actual_Vs_Target_logic_teamleader = (barIndex) => {
  const [chartData, setChartData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [allAgentsPerformance, setAllAgensPerformance] = useState(JSON.parse(localStorage.getItem('TeamLeader Actual')));
  const [agentsTarget, setAgentsTarget] = useState(localStorage.getItem('TotalTargetAgents')?.split(',') || []);
  const [agentMonth, setAgentMonth] = useState(JSON.parse(localStorage.getItem('Agents_KPI_Data')));
  const [poundSymbol, setPoundSymbol] = useState(""); // State to store the extracted pound symbol
  const poundSymbolRef = useRef(null); // Ref to access PoundSymbol component
  
  // Determine if pound symbol should be shown
  const shouldShowPound = barIndex.barIndex === 8 || barIndex.barIndex === 10;

  // Use effect to extract pound symbol from PoundSymbol component
  useEffect(() => {
    if (poundSymbolRef.current) {
      // Extract the text content from the span inside the PoundSymbol component
      const symbolText = poundSymbolRef.current.textContent;
      setPoundSymbol(symbolText);
    }
  }, []);

  const initialData = [
    { month: "Jan", target: 100000, actual: 410000 },
    { month: "Feb", target: 412500, actual: 403200 },
    { month: "Mar", target: 419000, actual: 428000 },
    { month: "Apr", target: 460300, actual: 430750 },
    { month: "May", target: 468000, actual: 438900 },
    { month: "June", target: 472500, actual: 475800 },
    { month: "July", target: 478250, actual: 465500 },
    { month: "Aug", target: 460300, actual: 455200 },
    { month: "Sep", target: 432000, actual: 438900 },
    { month: "Oct", target: 468000, actual: 455200 },
    { month: "Nov", target: 478250, actual: 438900 },
    { month: "Dec", target: 440500, actual: 462100 },
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
    console.log("Bar Index: ", barIndex.barIndex);
    const updatedInitialData = initialData.map((data, index) => {
      if (data.month === monthAbbreviations[agentMonth.month]) {
        return { ...data, target: agentsTarget[barIndex.barIndex], actual: allAgentsPerformance[0]?.aggregatedValues[barIndex.barIndex] };
      }
      return data;
    });

    // Set target and actual to 0 for months after the current month
    const currentMonthIndex = initialData.findIndex(data => data.month === monthAbbreviations[agentMonth.month]);
    const filteredData = updatedInitialData.filter((_, index) => index <= currentMonthIndex);

    localStorage.setItem('charts', JSON.stringify(filteredData));
    setChartData(filteredData);

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
  }, [barIndex]);

  // Modified to format without handling pound symbol
  const formatYAxis = (value) => {
    if (value === 0) return '0';
    if (value >= 1000) {
      return `${value / 1000}K`;
    }
    return `${value}`;
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
            {shouldShowPound ? 
              `${poundSymbol}${value < 1000 ? value : (value / 1000) + 'K'}` : 
              `${value < 1000 ? value : (value / 1000) + 'K'}`}
          </text>
        </g>
      );
    }
    return <circle cx={cx} cy={cy} r={6} fill="#22D3EE" stroke="#22D3EE" />;
  };

  return (
    <div className="w-full p-4 rounded-lg shadow-lg bg-white">
      {/* Hidden PoundSymbol component to extract the symbol */}
      <div style={{ display: "none" }}>
        <div ref={poundSymbolRef}>
          <PoundSymbol />
        </div>
      </div>
      
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
          tickFormatter={(value) => {
            // Use the extracted pound symbol
            if (shouldShowPound) {
              return `${poundSymbol}${formatYAxis(value)}`;
            }
            return formatYAxis(value);
          }}
        />
        <Tooltip
          formatter={(value, name) => {
            // Use the extracted pound symbol for tooltip
            return [shouldShowPound ? `${poundSymbol}${value.toLocaleString()}` : `${value.toLocaleString()}`, name];
          }}
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
                  {shouldShowPound ? 
                    `${poundSymbol}${value < 1000 ? value : (value / 1000) + 'K'}` : 
                    `${value < 1000 ? value : (value / 1000) + 'K'}`}
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

export default Actual_Vs_Target_logic_teamleader;