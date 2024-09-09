import classNames from "classnames";
import React, { FC } from "react";
// import { Link, Avatar } from '@components';
import { useRouter } from "next/router";
import Icon from "@mdi/react";
import { mdiLogoutVariant } from "@mdi/js";

// import ROUTES from '@utils/routes';
import Image from "next/image";
// import { CollapsibleCard } from '@components/collapsible';
import { ORG_NAVITEMS } from "@/src/utils/constants";
// import { Badge } from '@components/badge';

interface Props {
  avatarImage?: string;
  name?: string;
  orgName?: string;
  onLogout?: () => void;
}

export const SidebarMenu: FC<Props> = ({
  avatarImage,
  name,
  orgName,
  onLogout,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full items-start">
      {/* <div
        className="hidden lg:block cursor-pointer h-[50px] w-[140px] relative"
        onClick={() => router.push(ROUTES.HOME)}
      >
        <Image
          src={'/assets/img/logo-business.svg'}
          alt="Vascan Logo"
          layout="fill"
          className="object-contain"
          // height={56}
          // width={110}
        />
      </div> */}

      {/* <div className="flex gap-3 items-center lg:mt-16">
        <Avatar
          avatarImage={avatarImage}
          size="16"
          className="shadow-xl"
          bgColor="bg-black-dark"
          variant="curved"
        />
        <div className="">
          <p className="mb-1 text-black font-semibold">{name}</p>

          <p className="text-sm text-grey-8 line-clamp-1">{orgName}</p>
        </div>
      </div> */}
      <ul className="flex-1 mt-10 relative overflow-y-auto h-full w-full flex flex-col justify-between no-scrollbar">
        <div className="">
          {ORG_NAVITEMS.map((navItem) => {
            // const LinkComponent = !!navItem.href ? Link : 'div';
            const LinkComponent = "div";
            const hasChildren = navItem?.children?.length > 0;
            const isActive =
              navItem.children?.some(
                (child) => child.childrenHref === router.pathname
              ) || navItem.href === router.pathname;
            return (
              <li key={navItem.href} className="px-1 mb-2">
                <LinkComponent
                  // variant={isActive ? 'primary' : ''}
                  // href={navItem.href}
                  className={classNames(
                    "p-4 duration-200 flex items-center gap-2 cursor-pointer group",
                    isActive && !hasChildren
                      ? "bg-primary-lightest rounded-lg"
                      : "",
                    !hasChildren ? "hover:bg-primary-lightest rounded-lg" : ""
                  )}
                >
                  <CollapsibleCard
                    title={navItem.label}
                    // icon={navItem.icon}
                    titleIcon={navItem.titleIcon}
                    // childrenHref={navItem.href}
                    // childrenHref={navItem.children[0]?.childrenHref}
                    color={isActive ? "#ED6C00" : ""}
                    active={isActive}
                  >
                    {navItem.children?.length > 0 && (
                      <div className="pt-4">
                        {navItem.children.map((child) => (
                          <Link
                            variant={
                              router.pathname == child.childrenHref
                                ? "primary"
                                : ""
                            }
                            className={classNames(
                              "flex flex-col p-2 text-xs",
                              router.pathname == child.childrenHref
                                ? "text-primary"
                                : ""
                            )}
                            href={child.childrenHref}
                            key={child.childrenHref}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </CollapsibleCard>
                </LinkComponent>
              </li>
            );
          })}
        </div>

        <div className="">
          {ORB_BOTTOMNAVITEMS.map((navItem) => {
            const LinkComponent = !!navItem.href ? Link : "div";
            const hasChildren = navItem?.children?.length > 0;
            const isActive =
              navItem.children?.some(
                (child) => child.childrenHref === router.pathname
              ) || navItem.href === router.pathname;
            return (
              <li key={navItem.href} className="px-1 mb-2">
                <LinkComponent
                  variant={isActive ? "primary" : ""}
                  href={navItem.href}
                  className={classNames(
                    "p-4 duration-200 flex items-center gap-2 cursor-pointer group",
                    isActive && !hasChildren
                      ? "bg-primary-lightest rounded-lg"
                      : "",
                    !hasChildren ? "hover:bg-primary-lightest rounded-lg" : ""
                  )}
                >
                  <CollapsibleCard
                    title={navItem.label}
                    icon={navItem.icon}
                    titleIcon={navItem.titleIcon}
                    // childrenHref={navItem.href}
                    // childrenHref={navItem.children[0]?.childrenHref}
                    color={isActive ? "#ED6C00" : ""}
                    active={isActive}
                  >
                    {navItem.children?.length > 0 && (
                      <div className="pt-4">
                        {navItem.children.map((child) => (
                          <Link
                            variant={
                              router.pathname == child.childrenHref
                                ? "primary"
                                : ""
                            }
                            className={classNames(
                              "flex flex-col p-2 text-xs",
                              router.pathname == child.childrenHref
                                ? "text-primary"
                                : ""
                            )}
                            href={child.childrenHref}
                            key={child.childrenHref}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </CollapsibleCard>
                </LinkComponent>
              </li>
            );
          })}

          <li className="px-1">
            <div
              className="p-4 cursor-pointer text-error text-sm flex items-center gap-4"
              onClick={() => onLogout()}
            >
              <Icon path={mdiLogoutVariant} size={1} />
              Logout
            </div>
          </li>
        </div>
      </ul>
    </div>
  );
};

export const DashboardSidebar: FC<Props> = ({
  avatarImage,
  name,
  orgName,
  onLogout,
}) => {
  return (
    <div className=" hidden w w-72 bg-white shadow fixed top-0 left-0 h-screen lg:flex flex-col  z-[9990] p-6">
      <SidebarMenu
        avatarImage={avatarImage}
        name={name}
        orgName={orgName}
        onLogout={onLogout}
      />
    </div>
  );
};
