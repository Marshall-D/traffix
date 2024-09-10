import classNames from "classnames";
import React, { useMemo } from "react";
// import { Link, Avatar } from '@components';
// import { useRootStore } from '@mobx/index';
import { useRouter } from "next/router";
// import { observer } from 'mobx-react';
import Icon from "@mdi/react";
import logo from "../../assets/logo-new.png";

import {
  mdiDomain,
  mdiHomeVariantOutline,
  mdiImageOutline,
  mdiLogout,
  mdiScaleBalance,
  mdiCalendarBlankOutline,
  mdiShoppingOutline,
  mdiWalletOutline,
  mdiCogOutline,
  mdiLogoutVariant,
} from "@mdi/js";

// import ROUTES from '@utils/routes';
import Image from "next/image";
import ROUTES from "@/src/utils/routes";
import { Link } from "../link";

const navItems = [
  { href: ROUTES.ADMIN_DASHBOARD, label: "Dashboard" },
  {
    href: "",
    label: "Count Page",
  },
  { href: "", label: "Daily" },
  {
    href: "",
    label: "Weekly",
  },
  { href: "", label: "Monthly" },
  {
    href: ROUTES.ADMIN_USER_MANAGEMENT,
    label: "User Management",
  },

  // { href: ROUTES.ORG_LEGAL, label: 'Legal', icon: mdiScaleBalance },
];

export const SidebarMenu = () => {
  const router = useRouter();
  // const { authStore } = useRootStore();

  // const avatarImage = useMemo(
  //   () =>
  //     authStore.activeOrganization?.image ||
  //     // authStore.user?.image ||
  //     `https://via.placeholder.com/150/F6B680/FFFFFF?text=${
  //       authStore.computedName || authStore.computedOrgName || ''
  //     }`,
  //   [
  //     authStore.activeOrganization,
  //     // authStore.user?.image,
  //     authStore.computedName,
  //     authStore.computedOrgName,
  //   ]
  // );
  return (
    <div className="flex flex-col h-full items-start mt-9">
      <div className="hidden md:block mt-1 w-[134px]  h-[48px] relative">
        {/* className="hidden lg:block cursor-pointer h-[50px] w-[140px] relative"> */}

        <Image alt="Traffix logo" layout="fill" src={logo} />
      </div>{" "}
      {/* <div className="flex gap-3 items-center lg:mt-16">
        <Avatar
          avatarImage={avatarImage}
          size="16"
          className="shadow-xl"
          bgColor="bg-black-dark"
          variant="curved"
        />
        <div className="">
          <p className="mb-1 text-black font-semibold">
            {authStore.user?.firstname} {authStore.user?.lastname}
          </p>
          <p className="text-sm text-grey-8 line-clamp-1">
            {authStore.activeOrganization?.name}
          </p>
        </div>
      </div> */}
      <ul className="flex-1 mt-10 relative overflow-y-auto h-full  flex flex-col justify-between">
        <div className="">
          {navItems.map((navItem) => (
            <li key={navItem.href} className=" mt-4 mb-6">
              <p
              // href={navItem.href}
              // className={classNames(
              //   "p-4 hover:bg-primary-lightest hover:rounded-lg duration-200 flex items-center gap-2",
              //   router.pathname == navItem.href
              //     ? "bg-primary-lightest rounded-lg"
              //     : ""
              // )}
              >
                {/* {navItem.icon && (
                  <Icon
                    path={navItem.icon}
                    size={1}
                    color={router.pathname == navItem.href ? "#ED6C00" : ""}
                  />
                )} */}

                <a
                  href={navItem.href}
                  className={classNames(
                    "text-sm p-2 hover:text-primary hover:rounded-md  hover:border-primary hover:border",
                    router.pathname == navItem.href &&
                      "text-white hover:text-white  flex rounded-md p-2 bg-primary"
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
    </div>
  );
};

export const DashboardSidebar: React.FC = ({}) => {
  return (
    <div className=" hidden w w-72 bg-white shadow fixed top-0 left-0 h-screen lg:flex flex-col  z-[9990] p-6">
      <SidebarMenu />
    </div>
  );
};
