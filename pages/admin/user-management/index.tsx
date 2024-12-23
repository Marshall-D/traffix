import ClientForm from "@/src/components/client-form";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

const UserManagement = () => {
  // useAuthRedirect();

  return (
    <div className="lg:pl-72 ">
      <DashboardSidebar></DashboardSidebar>
      <div className="mb-36 lg:mb-0">
        <DashboardHeader title="User Management"></DashboardHeader>{" "}
      </div>
      <div className="flex justify-center mt-5">
        <h1>Admin Dashboard</h1>
      </div>
      <ClientForm />
    </div>
  );
};

export default UserManagement;
