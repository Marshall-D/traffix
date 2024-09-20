import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

const Monthly = () => {
  useAuthRedirect();

  return (
    <div className="lg:pl-72 ">
      <DashboardSidebar></DashboardSidebar>
      <div className="mb-36 lg:mb-0">
        <DashboardHeader title="Monthly"></DashboardHeader>{" "}
      </div>

      <div className="flex justify-center mt-5">
        <h1>Monthly </h1>
      </div>
    </div>
  );
};

export default Monthly;
