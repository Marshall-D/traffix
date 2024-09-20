import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

const Daily = () => {
  useAuthRedirect();

  return (
    <div className="lg:pl-72 ">
      <DashboardSidebar></DashboardSidebar>
      <DashboardHeader title="Daily"></DashboardHeader>{" "}
      <div className="flex justify-center mt-5">
        <h1>Daily </h1>
      </div>
    </div>
  );
};

export default Daily;
