import ClientForm from "@/src/components/client-form";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

const UserManagement = () => {
  useAuthRedirect();

  return (
    <div className="m-2   lg:pl-72 ">
      <DashboardSidebar></DashboardSidebar>
      <DashboardHeader title="User Management"></DashboardHeader>{" "}
      <div className="flex justify-center mt-5">
        <h1>Admin Dashboard</h1>
      </div>
      <ClientForm />
    </div>
  );
};

export default UserManagement;
