import classNames from "classnames";
import Image from "next/image";
import React, { FC } from "react";
import ProfileCard from "../profileCard";
import logo from "../../assets/logo-new.png";
import CountPageHero from "../countPageHero";

interface Props {
  label?: string;
}

const CountPageHeader: FC<Props> = ({ label }) => {
  return (
    <div className="flex  mt-16 mb-8  pb-4 px-4 justify-between border-b-2 border-b-grey md:border-b-0">
      <div className="">
        <div className="text-lg mt-2 md:hidden">
          <p>Count Page</p>{" "}
        </div>
        <div className="hidden md:block mt-1 w-[134px]  h-[48px] relative">
          <Image alt="logo" layout="fill" src={logo} />
        </div>{" "}
      </div>

      <div className=" hidden md:block  mt-[-10px]">
        <CountPageHero></CountPageHero>
      </div>

      <ProfileCard></ProfileCard>
    </div>
  );
};

export default CountPageHeader;
