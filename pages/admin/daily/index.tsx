import BarChart from "@/src/components/barChart";
import DailySectionOne from "@/src/components/dailySectionOne";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import HourlySectionOne from "@/src/components/hourlysection";
import LineChart from "@/src/components/lineChart";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

const Daily = () => {
  useAuthRedirect();
  const dailyData = {
    // label: "Sales",
    data: [12, 19, 3, 5, 2, 3, 7], // Example dynamic data
    // backgroundColor: "#FF5733",
    // borderColor: "#FF5733",
  };

  const dailyLineChartData = {
    // label: "Sales",
    data: [12, 19, 3, 5, 2, 3, 7], // Example dynamic data
    // backgroundColor: "#FF5733",
    // borderColor: "#FF5733",
  };
  const dailyLineChartDataTwo = {
    // label: "Sales",
    data: [2, 1, 13, 9, 6, 5, 1], // Example dynamic data
    backgroundColor: "#FF5733",
    borderColor: "#FF5733",
  };

  const dailyLineChartTitle = [
    "Congestion Trends",
    "From May 1 - 14 May, 2024",
  ];
  return (
    <div className="lg:pl-72 ">
      <DashboardSidebar></DashboardSidebar>
      <div className="mb-36 lg:mb-0">
        <DashboardHeader title="Daily Count Overview"></DashboardHeader>{" "}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mt-5 mx-4">
        <DailySectionOne></DailySectionOne>
        <HourlySectionOne></HourlySectionOne>
        <div className="flex flex-col w-full   gap-3 p-4 rounded-2xl border-2 border-grey  shadow-lg hover:bg-grey">
          <p className=" text-black font-medium">Summary</p>{" "}
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Total Count: </p>
            <p className="font-bold "> 300</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Total Count: </p>
            <p className="font-bold "> 300</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Total Count: </p>
            <p className="font-bold "> 300</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Total Count: </p>
            <p className="font-bold "> 300</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Total Count: </p>
            <p className="font-bold "> 300</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Total Count: </p>
            <p className="font-bold "> 300</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Total Count: </p>
            <p className="font-bold "> 300</p>
          </div>
        </div>
        <div className=" w-full justify-center   rounded-2xl p-9  border-2 border-grey gap-4 shadow-lg hover:bg-grey">
          <BarChart chartData={dailyData} chartTitle="Daily trend"></BarChart>
        </div>
        <div className=" w-full  justify-center   rounded-2xl p-9  border-2 border-grey gap-4 shadow-lg hover:bg-grey">
          <LineChart
            chartDataTwo={dailyLineChartDataTwo}
            chartData={dailyLineChartData}
            chartTitle={dailyLineChartTitle}
          ></LineChart>{" "}
        </div>{" "}
      </div>
    </div>
  );
};

export default Daily;
