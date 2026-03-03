import Image from "next/image";
import React, { FC } from "react";
import ProfileCard from "../profileCard";
import { useClientSession } from "@/src/hooks/useClientSession";
import logo from "../../assets/logo-new.png";
import CountPageHero from "../countPageHero";
import ROUTES from "@/src/utils/routes";

interface Props {
  isAdmin?: boolean;
}

const CountPageHeader: FC<Props> = ({ isAdmin = false }) => {
  const clientSession = useClientSession();

  return (
    <div className="flex  mt-16 mb-8  pb-4 px-4 justify-between border-b-2 border-b-grey lg:border-b-0">
      <div className="">
        <div className="text-lg mt-2 lg:hidden">
          <p>Count Page</p>{" "}
        </div>
        <div className="hidden lg:block mt-1 w-[134px]  h-[48px] relative">
          {isAdmin ? (
            <a href={ROUTES.ADMIN_DASHBOARD}>
              <Image alt="logo" layout="fill" src={logo} />
            </a>
          ) : (
            <Image alt="logo" layout="fill" src={logo} />
          )}
        </div>{" "}
      </div>

      <div className=" hidden lg:block  mt-[-10px]">
        <CountPageHero></CountPageHero>
      </div>

      <ProfileCard
        displayName={clientSession?.displayName}
        roleLabel={clientSession?.roleLabel}
      />
    </div>
  );
};

export default CountPageHeader;
