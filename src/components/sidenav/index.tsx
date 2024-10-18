import { IconButton } from "@/src/components/iconButton";
import {
  mdiViewDashboardOutline,
  mdiMenu,
  mdiPlusBoxOutline,
  mdiAlphaDBoxOutline,
  mdiAlphaWBoxOutline,
  mdiAlphaMBoxOutline,
  mdiAccount,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/router";
import classNames from "classnames";

import React, { useState } from "react";
import ROUTES from "@/src/utils/routes";

interface Props {
  admin?: any;
  onToggleMenu?: (isOpen: boolean) => void; // Callback to communicate with parent
}

const SideNav: React.FC<Props> = ({ admin, onToggleMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggleMenu) {
      onToggleMenu(newState); // Call the parent function to toggle title visibility
    }
  };

  const navItems = [
    {
      href: ROUTES.ADMIN_DASHBOARD,
      label: "Dashboard",
      icon: mdiViewDashboardOutline,
    },
    {
      href: `${ROUTES.ADMIN_COUNT_PAGE}/${admin}`,
      label: "Count Page",
      icon: mdiPlusBoxOutline,
    },
    {
      href: ROUTES.ADMIN_DAILY_PAGE,
      label: "Daily",
      icon: mdiAlphaDBoxOutline,
    },
    {
      href: ROUTES.ADMIN_WEEKLY_PAGE,
      label: "Weekly",
      icon: mdiAlphaWBoxOutline,
    },
    {
      href: ROUTES.ADMIN_MONTHLY_PAGE,
      label: "Monthly",
      icon: mdiAlphaMBoxOutline,
    },
    {
      href: ROUTES.ADMIN_USER_MANAGEMENT,
      label: "User Management",
      icon: mdiAccount,
    },
  ];

  return (
    <>
      {/* Hamburger menu for mobile */}
      <div className="lg:hidden mt-[-4px]">
        <IconButton
          size={1}
          className={`${
            isOpen ? "text-primary" : "text-black"
          } ml-auto cursor-pointer h-5 w-5`}
          path={mdiMenu}
          onClick={toggleMenu}
        />
      </div>

      {/* Dropdown menu for mobile */}
      <div
        className={`lg:hidden fixed top-24 left-0 w-full bg-white text-white overflow-hidden transition-all duration-500 ease-in-out shadow-lg lg:shadow-none ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          transition: "max-height 0.5s ease, opacity 0.5s ease", // Smooth transition for max-height and opacity
        }}
      >
        <nav className="flex text-black flex-col p-4">
          <ul className="flex-1 mt-10 relative overflow-y-auto h-full flex flex-col justify-between">
            <div className="">
              {navItems.map((navItem) => (
                <li key={navItem.href} className="my-1">
                  <p
                    className={classNames(
                      "p-2 hover:bg-primary-lightest hover:rounded-lg duration-200 flex items-center gap-2",
                      router.pathname === navItem.href
                        ? "bg-primary-lightest rounded-lg"
                        : ""
                    )}
                  >
                    {navItem.icon && (
                      <Icon
                        path={navItem.icon}
                        size={1}
                        color={
                          router.pathname === navItem.href ? "#0056B3" : ""
                        }
                      />
                    )}

                    <a
                      href={navItem.href}
                      className={classNames(
                        "text-sm text-black",
                        router.pathname === navItem.href &&
                          "hover:text-white text-primary"
                      )}
                    >
                      {navItem.label}
                    </a>
                  </p>
                </li>
              ))}
            </div>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default SideNav;
