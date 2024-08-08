import classNames from "classnames";
import Image from "next/image";
import React, { FC } from "react";
import avatar from "../../assets/avatar.png";

interface Props {
  label?: string;
}

const ProfileCard: FC<Props> = ({ label }) => {
  return (
    <div className="flex rounded-3xl md:border-2 md:border-grey md:px-4 md:py-1 md:gap-4 ">
      <div className="w-[40px]  h-[40px] md:w-[49px]  md:h-[49px]  relative">
        <Image alt="logo" layout="fill" src={avatar} />
      </div>{" "}
      <div className="hidden md:block mt-2">
        <p className="text-sm text-black">Amy Colindale</p>{" "}
        <p className="text-[10px] text-black">Security Guard</p>{" "}
      </div>
    </div>
  );
};

export default ProfileCard;
