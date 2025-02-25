import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const HalfDonutChart = ({ data, colors }) => {
  const options = {
    rotation: -90,
    circumference: 180,
    cutout: "92%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  const chartData = {
    labels: ["Progress", "Remaining"],
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };

  return (
    <div style={{ width: "150px", height: "150px", marginLeft: "18%" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

const Forecast_Commission_logic = (barIndex) => {
  const [forecastSummary, setForecastSummary] = useState(
    JSON.parse(localStorage.getItem("forecast_commission"))
  );
  const currency = "$";

  const [workingDays, setWorkingDays] = useState("");
  const [actualRevenue, setActualRevenue] = useState("");
  const [targetRevenue, setTargetRevenue] = useState("");
  const [totalDays, setTotalDays] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [opportunity, setOpportunity] = useState("");

  const months = {
    January: 21,
    February: 19,
    March: 21,
    April: 22,
    May: 21,
    June: 20,
    July: 22,
    August: 21,
    September: 21,
    October: 22,
    November: 18,
    December: 22,
  };

  useEffect(() => {
    const UserMonth = localStorage.getItem("Agents_KPI_Data");

    if (UserMonth) {
      const parsedData = JSON.parse(UserMonth);
      const opportunity = parsedData.opportunity;

      setOpportunity(opportunity);
      const monthName = parsedData.month;
      setSelectedMonth(monthName);
      const days = months[monthName];
      setTotalDays(days);
    }

    const myData = localStorage.getItem("Performace Table");
    if (myData) {
      const parsedData = JSON.parse(myData);
      console.log("PARse DATA FOREcast Target: ", parsedData)
      console.log("PARse DATA FOREcast Target: ", parsedData[barIndex.barIndex].target)
      console.log("PARse DATA FOREcast Actual: ", parsedData[barIndex.barIndex].actual)
      // const avgMonthlyRevenue = parsedData.find(
      //   (item) => item.kpi === "Appraisals"
      // );

      setActualRevenue(parsedData[barIndex.barIndex].actual);
      setTargetRevenue(parsedData[barIndex.barIndex].target);
    }

    const actuals = localStorage.getItem("tableData1");
    if (actuals) {
      const parsedActuals = JSON.parse(actuals);
      setWorkingDays(parsedActuals.length);
    }
  }, []);

  // useEffect(()=>{


  //   localStorage.setItem( "forcast_percentage",(
  //     (((actualRevenue / workingDays) * totalDays) / targetRevenue) * 100
  //   ).toFixed(2))

  // },[]);

  useEffect(() => {
    const forecast = actualRevenue && workingDays && targetRevenue && totalDays
      ? ((((actualRevenue / workingDays) * totalDays) / targetRevenue) * 100).toFixed(2)
      : "0";

    localStorage.setItem("forcast_percentage", forecast);
  }, [actualRevenue, workingDays, targetRevenue, totalDays]);

  useEffect(() => {
    localStorage.setItem("forecastSummary", JSON.stringify(forecastSummary));
    localStorage.setItem("workingDays", JSON.stringify(workingDays));
    localStorage.setItem("actualRevenue", JSON.stringify(actualRevenue));
    localStorage.setItem("targetRevenue", JSON.stringify(targetRevenue));
    localStorage.setItem("totalDays", JSON.stringify(totalDays));
    localStorage.setItem("selectedMonth", JSON.stringify(selectedMonth));
    localStorage.setItem("opportunity", JSON.stringify(opportunity));
  }, [
    forecastSummary,
    workingDays,
    actualRevenue,
    targetRevenue,
    totalDays,
    selectedMonth,
    opportunity,
  ]);

  return (
    <div className="">
      <div className="flex-1 flex flex-col justify-center items-center text-center rounded-lg">
        <h3 className="font-medium text-gray-800">Forecast Finish</h3>
        <p className="text-xs text-green-600 mb-4">
          ^ {(
            (((actualRevenue / workingDays) * totalDays) / targetRevenue) * 100
          ).toFixed(1)}% to target
        </p>
        <div className="relative flex justify-center mr-6 items-center -mt-9">
          <HalfDonutChart
            data={[
              Math.min((
                (((actualRevenue / workingDays) * totalDays) / targetRevenue) * 100
              ), 100),
              Math.max(0, 100 - (
                (((actualRevenue / workingDays) * totalDays) / targetRevenue) * 100
              )),
            ]}
            colors={["#10b981", "#f3f4f6"]}
          />
          <div className="absolute inset-3 w-full flex mt-16 flex-col justify-evenly items-center">
            <p className="text-green-500 text-2xl font-normal">
              ${(((actualRevenue / workingDays) * totalDays) < 1000
                ? ((actualRevenue / workingDays) * totalDays).toFixed(1)
                : (((actualRevenue / workingDays) * totalDays) / 1000).toFixed(1))}{(((actualRevenue / workingDays) * totalDays) < 1000) ? '' : 'K'}
            </p>
            <div className="flex justify-between text-sm text-gray-500 w-full">
              <span className="-ml-1 mt-2">
                $0
              </span>
              <span className="ml-20 mt-2">
                ${targetRevenue < 1000 ? targetRevenue : (targetRevenue / 1000).toFixed(1)}{targetRevenue < 1000 ? '' : 'K'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast_Commission_logic;
