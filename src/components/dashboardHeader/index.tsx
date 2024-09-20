import React, { FC, useState } from "react";
import ProfileCard from "../profileCard";
import SideNav from "../sidenav";

interface Props {
  title?: string;
  admin?: any;
}

const DashboardHeader: FC<Props> = ({ title, admin }) => {
  const [isTitleVisible, setIsTitleVisible] = useState(true);

  const handleToggleMenu = (isOpen: boolean) => {
    setIsTitleVisible(!isOpen); // Toggle the title visibility
  };

  return (
    <>
      <div className="flex w-full pt-12  lg:pt-0 lg:mt-16 lg:my-8  fixed lg:static  top-0 z-[999]  bg-white pb-4 px-4 justify-between border-b border-b-grey lg:border-b-0 shadow-lg lg:shadow-none  ">
        <div className="flex gap-6">
          <SideNav admin={admin} onToggleMenu={handleToggleMenu}></SideNav>
          <div
            className={`text-lg font-medium mt-0 text-grey-2 transition-opacity duration-500 ease-in-out ${
              isTitleVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <p>{title}</p>
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
