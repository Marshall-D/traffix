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

  return (
    <div>
      <CountPageHeader></CountPageHeader>
      <div className="md:hidden  items-center mb-24">
        <CountPageHero></CountPageHero>
      </div>
      <div id="count-body" className=" w-full max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between ">
          <div id="IconButton-minus">
            <div className="md:hidden">
              <IconButton
                size={2}
                path={mdiMinusCircle}
                iconColor="text-primary"
                onClick={() => setShowModal(true)}
              ></IconButton>{" "}
            </div>{" "}
            <div className="hidden md:block">
              <IconButton
                size={4}
                path={mdiMinusCircle}
                iconColor="text-primary"
                onClick={() => setShowModal(true)}
              ></IconButton>{" "}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              <p className="md:text-lg">Current Count</p>

              <div>
                <IconButton
                  size={0.8}
                  path={mdiAlphaICircleOutline}
                  onClick={() => setShowModal(true)}
                ></IconButton>{" "}
              </div>
            </div>
            <div className="mb-10">
              <p className="text-5xl md:text-8xl font-extrabold">0</p>
            </div>
          </div>
          <div id="IconButton-plus">
            <div className="md:hidden">
              <IconButton
                size={2}
                path={mdiPlusCircle}
                iconColor="text-primary"
              ></IconButton>{" "}
            </div>{" "}
            <div className="hidden md:block">
              <IconButton
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
        // label={"Change Invoice Status"}
        maxWidth="max-w-3xl"
        handleClose={() => {
          setShowModal(false);
        }}
        footer={
          <div className="flex justify-end gap-2 min-w-[350px]">
            <Button
              type="submit"
              onClick={() => setShowModal(false)}
              variant="social"
            >
              No
            </Button>
            <Button
              className=" bg-primary hover:bg-primary-light text-grey"
              type="submit"
              onClick={() => setShowModal(false)}
              variant="primary"
            >
              Yes
            </Button>
          </div>
        }
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* {changeableInvoiceStatuses.map((invoiceStatus: InvoiceStatus) => (
            <InvoiceStatusCard
              key={invoiceStatus}
              status={InvoiceStatus[invoiceStatus]}
              selected={invoiceStatus === displayedInvoice?.paymentStatus}
              onSelect={() => {
                setDisplayedInvoice((prev) => ({
                  ...prev,
                  paymentStatus: invoiceStatus,
                }));
                setUpdatedInvoiceStatus(invoiceStatus);
              }}
            />
          ))} */}
          {/* <ProfileCard></ProfileCard> */}
          <p>Are you sure you want to delete this entry ?</p>
        </div>
      </Modal>
    </div>
  );
};

export default CountPage;
