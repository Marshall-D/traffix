import classNames from "classnames";
import Image from "next/image";
import React, { FC } from "react";
import ProfileCard from "../profileCard";
import logo from "../../assets/logo-new.png";

interface Props {
  label?: string;
}

const CountPageHeader: FC<Props> = ({ label }) => {
  return (
    <div className="flex  mt-16 mb-8  pb-4 px-4 justify-between border-b-2 border-b-grey md:border-b-0">
      <div className="">
        <div className="text-lg md:hidden">
          <p>Count Page</p>{" "}
        </div>
        <div className="hidden md:block  w-[131px]  h-[51px] relative">
          <Image alt="logo" layout="fill" src={logo} />
        </div>{" "}
      </div>

      <ProfileCard></ProfileCard>
    </div>
  );
};

export default CountPageHeader;
