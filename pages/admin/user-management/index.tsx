// pages/admin/user-management/index.tsx
import React from "react";
import withAuth from "@/src/hocs/withAuth";
import ClientForm from "@/src/components/client-form";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import { useAuth } from "@/src/context/AuthContext";

/**
 * User management page (client-side protected via withAuth)
 *
 * We pass a small `admin` prop derived from the authenticated user for
 * building admin-specific URLs in the sidebar (e.g. count page).
 */
const UserManagement: React.FC = () => {
  const { user } = useAuth();

  // Derive a safe admin identifier for URL paths (prefer userId/_id, fallback to email)
  const adminId = user?.userId ?? user?._id ?? user?.email ?? "";

  return (
    <div className="lg:pl-72">
      <DashboardSidebar admin={adminId} />
      <div className="mb-36 lg:mb-0">
        <DashboardHeader title="User Management" admin={user} />
      </div>

      <div className="flex justify-center mt-5">
        <h1 className="sr-only">Admin User Management</h1>
      </div>

      <ClientForm />
    </div>
  );
};

// Export the page wrapped with the auth HOC so it redirects unauthenticated users to /login
export default withAuth(UserManagement);
