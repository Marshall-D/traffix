// src/components/dashboardSidebar/index.tsx
import classNames from "classnames";
import React from "react";
import { useRouter } from "next/router";
import logo from "../../assets/logo-new.png";
import Image from "next/image";
import ROUTES from "@/src/utils/routes";
import { IDashboardSidebar } from "@/src/types";
import useClientForm from "@/src/hooks/useClientForm";
import useLogout from "@/src/hooks/useLogout";

/**
 * SidebarMenu: navigation + sign out button at bottom (desktop),
 * and a mobile nav block (visible on small screens) that includes the same sign out button.
 */
export const SidebarMenu: React.FC<IDashboardSidebar> = ({ admin }) => {
  const router = useRouter();
  const { logout, loading } = useLogout();

  const handleSignOut = async () => {
    await logout();
    // signOut already redirects to /login inside AuthProvider.signOut
  };
  const navItems = [
    { href: ROUTES.ADMIN_DASHBOARD, label: "Dashboard" },
    { href: `${ROUTES.ADMIN_COUNT_PAGE}/${admin}`, label: "Count Page" },
    { href: ROUTES.ADMIN_MONTHLY_PAGE, label: "Monthly" },
    { href: ROUTES.ADMIN_WEEKLY_PAGE, label: "Weekly" },
    { href: ROUTES.ADMIN_DAILY_PAGE, label: "Daily" },
    { href: ROUTES.ADMIN_USER_MANAGEMENT, label: "User Management" },
  ];

  return (
    <div className="flex flex-col h-full items-start mt-9">
      {/* Logo */}
      <div className="hidden md:block mt-1 w-[134px] h-[48px] relative">
        <Image alt="Traffix logo" layout="fill" src={logo} />
      </div>

      {/* Desktop nav area */}
      <ul className="flex-1 mt-10 relative overflow-y-auto h-full flex flex-col justify-between">
        <div>
          {navItems.map((navItem) => (
            <li key={navItem.label} className="mt-4 mb-6 p-2">
              <a
                href={navItem.href}
                className={classNames(
                  "text-sm p-2",
                  router.pathname === navItem.href &&
                    "bg-primary text-white rounded-md p-2 ",
                  router.pathname !== navItem.href &&
                    "hover:text-primary hover:rounded-md hover:border-primary hover:border"
                )}
              >
                <span className={classNames("inline-block")}>
                  {navItem.label}
                </span>
              </a>
            </li>
          ))}
        </div>

        {/* Sign Out (bottom desktop) - styled red like original */}
        <div className="w-full pt-4">
          <li className="mt-4 mb-6 p-2 w-full">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={loading}
              className="text-sm block w-full text-center p-2 bg-red-500 hover:bg-red-700 text-white rounded-md"
              aria-label="Sign out"
            >
              {loading ? "Signing out…" : "Sign out"}
            </button>
          </li>
        </div>
      </ul>
    </div>
  );
};

export const DashboardSidebar: React.FC<IDashboardSidebar> = ({ admin }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden w-72 bg-white shadow fixed top-0 left-0 h-screen lg:flex flex-col z-[9990] p-6">
        <SidebarMenu admin={admin} />
      </div>

      {/* The mobile nav block is rendered inside SidebarMenu (lg:hidden). 
          For pages that don't have a dedicated mobile nav container, this will show
          a small mobile nav area wherever <DashboardSidebar /> is used. */}
    </>
  );
};
