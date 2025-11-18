import Image from "next/image";
import React, { FC } from "react";
import avatar from "../../assets/avatar.png";
import { useAuth } from "@/src/context/AuthContext";

const ProfileCard: FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex rounded-2xl md:border-2 md:border-grey md:px-4 md:py-1 md:gap-4 shadow-lg hover:bg-grey cursor-pointer">
      <div className="w-[40px]  h-[40px] md:w-[49px]  md:h-[49px]  relative">
        <Image alt="logo" layout="fill" src={avatar} />
      </div>{" "}
      <div className="hidden md:block mt-2">
        {user ? (
          <p className="text-sm text-black">
            {user?.firstName} {user?.lastName}
          </p>
        ) : (
          <div className="text-sm">Not signed in</div>
        )}
        <p className="text-[10px] text-black">Security Guard</p>{" "}
      </div>
    </div>
  );
};

export default ProfileCard;
