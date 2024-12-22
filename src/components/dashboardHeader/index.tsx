import React, { FC, useState } from "react";
import BusiestDay from "../busiestDay";
import ProfileCard from "../profileCard";
import SideNav from "../sidenav";

interface Props {
  title?: string;
  admin?: any;
  showDailySection?: boolean;
  busiestDay?: string | null; // Accept the day string
}

const DashboardHeader: FC<Props> = ({
  title,
  admin,
  showDailySection,
  busiestDay,
}) => {
  const [isTitleVisible, setIsTitleVisible] = useState(true);

  const handleToggleMenu = (isOpen: boolean) => {
    setIsTitleVisible(!isOpen);
  };

  return (
    <>
      <div className="flex w-full pt-12 lg:pt-0 lg:mt-16 lg:my-8 fixed lg:static top-0 z-[999] bg-white pb-4 px-4 justify-between border-b border-b-grey lg:border-b-0 shadow-lg lg:shadow-none">
        <div className="flex gap-6">
          <SideNav admin={admin} onToggleMenu={handleToggleMenu}></SideNav>
          <div className="flex flex-col">
            {showDailySection && (
              <div
                className={`text-sm text-black-2 font-medium mt-1 transition-opacity duration-500 ease-in-out ${
                  isTitleVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <p>
                  <span className="text-grey-4">Weekly</span> / Count details
                </p>
              </div>
            )}
            <p className="text-lg my-2">{title}</p>
            {showDailySection && busiestDay && <BusiestDay day={busiestDay} />}
          </div>
        </div>
        <div>
          <ProfileCard></ProfileCard>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
