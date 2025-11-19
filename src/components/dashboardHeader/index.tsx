// src/components/dashboardHeader/index.tsx
import React, { FC, useState } from "react";
import BusiestDay from "../busiestDay";
import ProfileCard from "../profileCard";
import SideNav from "../sidenav";
import TodaysCount from "../todaysCount";
import { useRouter } from "next/router";
import ROUTES from "@/src/utils/routes";

interface Props {
  title?: string;
  admin?: any;
  showDailySection?: boolean;
  busiestDay?: string | null; // Accept the day string
  daily?: boolean;
}

const DashboardHeader: FC<Props> = ({
  title,
  admin,
  showDailySection,
  busiestDay,
  daily,
}) => {
  const [isTitleVisible, setIsTitleVisible] = useState(true);

  const handleToggleMenu = (isOpen: boolean) => {
    setIsTitleVisible(!isOpen);
  };

  const router = useRouter();

  const handleRedirect = () => {
    router.push(ROUTES.ADMIN_USER_MANAGEMENT);
  };

  return (
    <>
      <div className="flex w-full pt-12 lg:pt-0 lg:mt-16 lg:my-8 fixed lg:static top-0 z-[999] bg-white pb-4 px-4 justify-between border-b border-b-grey lg:border-b-0 shadow-lg lg:shadow-none">
        <div className="flex gap-6">
          <SideNav admin={admin} onToggleMenu={handleToggleMenu}></SideNav>
          <div className="flex flex-col mt-1 ">
            {showDailySection && (
              <div
                className={`text-sm text-black-2 font-medium transition-opacity duration-500 ease-in-out ${
                  isTitleVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="hidden lg:block">
                  <span className="text-grey-4">Weekly</span> / Count details
                </p>
              </div>
            )}
            <p className="text-lg my-2">{title}</p>
            {showDailySection && busiestDay && (
              <div className="hidden lg:block">
                <BusiestDay day={busiestDay} />{" "}
              </div>
            )}
            {daily && (
              <div className="hidden lg:block">
                <TodaysCount count={128} />{" "}
              </div>
            )}
          </div>
        </div>
        <div onClick={handleRedirect}>
          <ProfileCard></ProfileCard>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
