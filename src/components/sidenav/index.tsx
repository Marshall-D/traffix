import { Dialog, Transition } from "@headlessui/react";
import { mdiClose, mdiMenu } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import React, { Fragment, useMemo, useState } from "react";
// import { IconButton } from '@components';
// import { useRootStore } from '@mobx/index';
// import { SidebarMenu } from '@components/dashboardSidebar';
import Image from "next/image";
import { IconButton } from "../iconButton";
import { SidebarMenu } from "../dashboardSidebar";
// import { UserRole } from '@utils/enums/user.enum';
// import { CustomerSidebarMenu } from '@components/customerSidebar';
// import { observer } from 'mobx-react';

interface items {
  name: string;
  url: string;
}

export type ISideNav = {
  items?: items[];
  className: string;
  isLoggedIn?: boolean;
};

export const SideNav: React.FC<ISideNav> = ({
  className,
  items = [],
  isLoggedIn,
}) => {
  let [isOpen, setIsOpen] = useState(false);
  // const { authStore } = useRootStore();

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const classes = classNames("flex lg:hidden", className);

  // const avatarImage = useMemo(
  //   () =>
  //     authStore.activeOrganization?.image ||
  //     // authStore.user?.image ||
  //     `https://via.placeholder.com/150/F6B680/FFFFFF?text=${
  //       authStore.computedName || authStore.computedOrgName || ''
  //     }`,
  //   [
  //     authStore.activeOrganization,
  //     // authStore.user?.image,
  //     authStore.computedName,
  //     authStore.computedOrgName,
  //   ]
  // );

  return (
    <div className={classes}>
      {/* Cart Icon and item counter */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={openModal}
      >
        {/* <Menu /> */}
        <Icon
          size={1}
          className="text-black ml-auto cursor-pointer h-5 w-5"
          path={mdiMenu}
        ></Icon>
      </div>
      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={closeModal}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          {/* END Backdrop */}

          {/* Modal */}
          <div className="fixed left-0 top-0 overflow-y-auto h-full">
            <div className="flex min-h-full items-center justify-center h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-80"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex flex-col justify-items-start h-full w-72 max-w-md transform bg-white p-6 text-left shadow-xl transition-all z-[9999] overflow-y-hidden">
                  {/* Title */}
                  <Dialog.Title
                    as="div"
                    className="text-xl font-medium leading-6 text-gray-900 flex items-center mb-10 justify-between"
                  >
                    <IconButton
                      path={mdiClose}
                      iconColor="text-black"
                      size={1}
                      className=""
                      onClick={closeModal}
                    >
                      close
                    </IconButton>
                    <Image
                      src={"/assets/img/vascan-logo.svg"}
                      alt="Vascan Logo"
                      height={30}
                      width={28}
                    />
                  </Dialog.Title>

                  {/* Content */}
                  <div className="relative h-full">
                    <SidebarMenu
                    // avatarImage={avatarImage}
                    // name={`${authStore.user?.firstname || ''} ${
                    //   authStore.user?.lastname || ''
                    // }`}
                    // orgName={authStore.activeOrganization?.name}
                    // onLogout={() => authStore.logOut()}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          {/* END Modal */}
        </Dialog>
      </Transition>
    </div>
  );
};
