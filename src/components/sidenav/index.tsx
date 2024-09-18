import { IconButton } from "@/src/components/iconButton";
import {
  mdiViewDashboard,
  mdiMenu,
  mdiPlusBoxOutline,
  mdiAlphaDBoxOutline,
  mdiAlphaWBox,
  mdiAlphaMBox,
  mdiAccount,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/router";
import classNames from "classnames";

import React, { useState } from "react";
import ROUTES from "@/src/utils/routes";

const SideNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    {
      href: ROUTES.ADMIN_DASHBOARD,
      label: "Dashboard",
      icon: mdiViewDashboard,
    },
    {
      href: "",
      label: "Count Page",
      icon: mdiPlusBoxOutline,
    },
    { href: "", label: "Daily", icon: mdiAlphaDBoxOutline },
    {
      href: "",
      label: "Weekly",
      icon: mdiAlphaWBox,
    },
    { href: "", label: "Monthly", icon: mdiAlphaMBox },
    {
      href: ROUTES.ADMIN_USER_MANAGEMENT,
      label: "User Management",
      icon: mdiAccount,
    },
  ];
  return (
    <>
      {/* Hamburger menu for mobile */}
      <div className="lg:hidden mt-[-4px] ">
        {isOpen ? (
          <IconButton
            size={1}
            className="text-black ml-auto cursor-pointer h-5 w-5"
            path={mdiMenu}
            iconColor="text-primary"
            onClick={() => toggleMenu()}
          ></IconButton>
        ) : (
          <IconButton
            size={1}
            className="text-black ml-auto cursor-pointer h-5 w-5"
            path={mdiMenu}
            onClick={toggleMenu}
          ></IconButton>
        )}
      </div>

      {/* Dropdown menu for mobile */}
      <div
        className={`lg:hidden fixed top-16 left-0 w-full bg-white text-white overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
        style={{
          height: isOpen ? "auto" : "0",
        }}
      >
        <nav
          className={`flex text-black flex-col p-4 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex-1 mt-10 relative overflow-y-auto h-full  flex flex-col justify-between">
            <div className="">
              {navItems.map((navItem) => (
                <li key={navItem.href} className=" my-1">
                  <p
                    className={classNames(
                      "p-2 hover:bg-primary-lightest hover:rounded-lg duration-200 flex items-center gap-2",
                      router.pathname == navItem.href
                        ? "bg-primary-lightest rounded-lg"
                        : ""
                    )}
                  >
                    {navItem.icon && (
                      <Icon
                        path={navItem.icon}
                        size={1}
                        color={router.pathname == navItem.href ? "#0056B3" : ""}
                      />
                    )}

                    <a
                      href={navItem.href}
                      className={classNames(
                        "text-sm text-black",
                        router.pathname == navItem.href &&
                          " hover:text-white   text-primary"
                      )}
                    >
                      {" "}
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
