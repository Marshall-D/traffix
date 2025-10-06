import classNames from "classnames";
import React from "react";
import { useRouter } from "next/router";
import logo from "../../assets/logo-new.png";
import Image from "next/image";
import ROUTES from "@/src/utils/routes";
import { IDashboardSidebar } from "@/src/types";

export const SidebarMenu: React.FC<IDashboardSidebar> = ({ admin }) => {
  const router = useRouter();

  const navItems = [
    { href: ROUTES.ADMIN_DASHBOARD, label: "Dashboard" },
    { href: `${ROUTES.ADMIN_COUNT_PAGE}/${admin}`, label: "Count Page" },
    // { href: ROUTES.ADMIN_MONTHLY_PAGE, label: "Monthly" },
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

      {/* Navigation Menu */}

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
      </ul>
    </div>
  );
};

export const DashboardSidebar: React.FC<IDashboardSidebar> = ({ admin }) => {
  return (
    <div className="hidden w-72 bg-white shadow fixed top-0 left-0 h-screen lg:flex flex-col z-[9990] p-6">
      <SidebarMenu admin={admin} />
    </div>
  );
};
