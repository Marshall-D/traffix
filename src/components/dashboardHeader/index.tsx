import React, { FC } from "react";
import ProfileCard from "../profileCard";

import SideNav from "../sidenav";

interface Props {
  title?: string;
}

const DashboardHeader: FC<Props> = ({ title }) => {
  return (
    <>
      <div className="flex  lg:mt-16 my-8  sticky top-0 z-[999]  bg-white pb-4 px-4 justify-between border-b border-b-grey lg:border-b-0 shadow-lg lg:shadow-none  ">
        <div className="flex gap-6">
          <SideNav></SideNav>
          <div className="text-lg font medium mt-2 text-grey-2 ">
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
