import ClientForm from "@/src/components/client-form";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

const UserManagement = () => {
  useAuthRedirect();

  return (
    <div>
      <div className="flex justify-center mt-5">
        <h1>Admin Dashboard</h1>
      </div>
      <ClientForm />
    </div>
  );
};

export default UserManagement;
