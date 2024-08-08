import classNames from "classnames";
import React, { Fragment } from "react";
import { IModal } from "./Modal";
import { Dialog, Transition } from "@headlessui/react";
import { mdiClose } from "@mdi/js";
import { IconButton } from "../iconButton";

export const Modal: React.FC<IModal> = ({
  handleClose,
  label,
  className,
  children,
  isOpen = false,
  bgColor = "bg-grey-1",
  maxWidth = "max-w-lg",
  footer,
}) => {
  const classes = classNames("relative z-[50]", className);
  const closeModal = () => {
    handleClose();
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className={classes} onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div></div>
            {/* <div className="fixed inset-0 bg-black bg-opacity-25 overflow-hidden"></div> */}
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto z-[25]">
            <div className="flex flex-col min-h-full items-center  justify-center p-4 text-center relative">
              <Transition.Child
                as={"div"}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* <div className="mb-3 z-[9999] sticky top-4 flex flex-row-reverse mr-2">
                  <IconButton
                    path={mdiClose}
                    iconColor="text-error"
                    size={1}
                    className=""
                    bgColor="bg-grey-4/90"
                    onClick={closeModal}
                  >
                    close
                  </IconButton>
                </div> */}
                <Dialog.Panel
                  className={classNames(
                    `${bgColor} w-full  transform text-left align-middle shadow-xl  rounded-2xl transition-all pt-8 md:pt-0`,
                    maxWidth
                  )}
                >
                  {/* <div className="border-b border-primar=== py-5 px-6">
                    <Dialog.Title
                      as="h3"
                      className=" flex justify-between font-bold  text-black"
                    >
                      {label}
                      <IconButton
                          path={mdiClose}
                          iconColor="text-black"
                          size={1}
                          className="mt-[-10px] !p-0"
                          // bgColor="bg-grey-4/90"
                          onClick={closeModal}
                        ></IconButton>
                    </Dialog.Title>
                  </div> */}
                  <div className="p-1">{children}</div>

                  {footer && (
                    <div className="bg-grey-6 rounded-b-2xl py-5 px-6">
                      {footer}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
