import classNames from "classnames";
import Image from "next/image";
import React, { FC } from "react";
import ProfileCard from "../profileCard";
import logo from "../../assets/logo-new.png";
import CountPageHero from "../countPageHero";
import ROUTES from "@/src/utils/routes";
import { SideNav } from "../sidenav";
import { DashboardSidebar } from "../dashboardSidebar";

interface Props {
  title?: string;
}

const DashboardHeader: FC<Props> = ({ title }) => {
  return (
    <>
      {/* <DashboardSidebar></DashboardSidebar> */}

      <div className="flex  mt-16 mb-8  pb-4 px-4 justify-between border-b-2 border-b-grey md:border-b-0">
        <div className="">
          <div className="text-lg font medium mt-2 text-grey-2 ">
            <p>{title}</p>
          </div>
        </div>

        <ProfileCard></ProfileCard>
      </div>
    </>
  );
};

export default DashboardHeader;

{
  /* <div
className={classNames(
  'pb-10 w-full',
  // Container,
  isLoggedIn && 'lg:pl-72'
)}
// className={classNames('pb-10 w-full', )}
> */
}
