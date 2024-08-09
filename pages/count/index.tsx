import React, { useState } from "react";
import classNames from "classnames";
import { ICountPage } from "@/src/types";
import { Button } from "@/src/components/button";
import CountPageHeader from "@/src/components/countPageHeader";
import CountPageHero from "@/src/components/countPageHero";
import { IconButton } from "@/src/components/iconButton";
import { mdiAlphaICircleOutline, mdiPlusCircle, mdiMinusCircle } from "@mdi/js";
import ProfileCard from "@/src/components/profileCard";
import { Modal } from "@/src/components/modal";

const CountPage: React.FC<ICountPage> = () => {
  const [showModal, setShowModal] = useState(false);
  const [infoButton, setInfoButton] = useState(true);
  const [count, setCount] = useState<number>(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const confirmDecrement = () => {
    setCount((prevCount) => Math.max(prevCount - 1, 0));
    setShowModal(false);
  };

  const cancelDecrement = () => {
    setShowModal(false);
  };
  return (
    <div>
      <CountPageHeader></CountPageHeader>

      <div className="md:hidden  items-center ">
        <CountPageHero></CountPageHero>
      </div>

      <div id="count-body" className=" w-full max-w-[1000px] mt-48 mx-auto">
        <div className="flex items-center justify-between ">
          <div id="IconButton-minus">
            <div className="md:hidden">
              <IconButton
                disabled={count === 0}
                size={2}
                path={mdiMinusCircle}
                iconColor="text-primary"
                onClick={() => {
                  setInfoButton(false), setShowModal(true);
                }}
              ></IconButton>{" "}
            </div>{" "}
            <div className="hidden md:block">
              <IconButton
                disabled={count === 0}
                size={4}
                path={mdiMinusCircle}
                iconColor="text-primary"
                onClick={() => {
                  setInfoButton(false), setShowModal(true);
                }}
              ></IconButton>{" "}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              <p className="md:text-lg">Current Count</p>

              <div data-tooltip-target="tooltip-default">
                <IconButton
                  size={0.8}
                  path={mdiAlphaICircleOutline}
                  onClick={() => {
                    setInfoButton(true), setShowModal(true);
                  }}
                ></IconButton>
              </div>

              {/* tooltip */}
              <div
                id="tooltip-default"
                role="tooltip"
                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                Tooltip content
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-5xl md:text-8xl font-extrabold">{count}</p>
            </div>
          </div>

          <div id="IconButton-plus">
            <div className="md:hidden">
              <IconButton
                onClick={handleIncrement}
                size={2}
                path={mdiPlusCircle}
                iconColor="text-primary"
              ></IconButton>{" "}
            </div>{" "}
            <div className="hidden md:block">
              <IconButton
                onClick={handleIncrement}
                size={4}
                path={mdiPlusCircle}
                iconColor="text-primary"
              ></IconButton>{" "}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        bgColor="bg-white"
        maxWidth="max-w-3xl"
        handleClose={() => {
          setShowModal(false);
        }}
      >
        <div className="flex flex-col gap-2 items-center justify-center p-12">
          {infoButton && (
            <p className="">
              This application is used to count the vehicles coming into the
              site. It resets at 12 midnight everyday.
            </p>
          )}

          {!infoButton && (
            <div className=" flex flex-col gap-2">
              <p>Are you sure you want to delete this entry ?</p>
              <div className="flex  items-center justify-center gap-2">
                <Button
                  type="submit"
                  onClick={cancelDecrement}
                  variant="social"
                >
                  No
                </Button>
                <Button
                  className=" bg-primary hover:bg-primary-light text-grey"
                  type="submit"
                  onClick={confirmDecrement}
                  variant="primary"
                >
                  Yes
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CountPage;
