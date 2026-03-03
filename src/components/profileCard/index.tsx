import Image from "next/image";
import React, { FC } from "react";
import avatar from "../../assets/avatar.png";
import { ROLE_LABELS } from "@/src/constants/roles";
import { Role } from "@/src/constants/roles";
import { useAuth } from "@/src/context/AuthContext";

export interface ProfileCardProps {
  /** When provided with roleLabel, overrides auth-based display (e.g. client context). */
  displayName?: string;
  /** Subtitle under the name (e.g. "Admin", "Security guard"). */
  roleLabel?: string;
}

const ProfileCard: FC<ProfileCardProps> = ({ displayName, roleLabel }) => {
  const { user } = useAuth();

  const useOverride = displayName != null && roleLabel != null;
  const name = useOverride
    ? displayName
    : user
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
      : "Not signed in";
  const subtitle = useOverride
    ? roleLabel
    : user
      ? (user.role === Role.Admin || user.role === Role.Client
          ? ROLE_LABELS[user.role]
          : ROLE_LABELS[Role.Admin])
      : undefined;

  return (
    <div className="flex rounded-2xl md:border-2 md:border-grey md:px-4 md:py-1 md:gap-4 shadow-lg hover:bg-grey cursor-pointer">
      <div className="w-[40px]  h-[40px] md:w-[49px]  md:h-[49px]  relative">
        <Image alt="logo" layout="fill" src={avatar} />
      </div>{" "}
      <div className="hidden md:block mt-2">
        <p className="text-sm text-black">{name}</p>
        {subtitle != null && (
          <p className="text-[10px] text-black">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
