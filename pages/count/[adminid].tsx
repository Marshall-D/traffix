// pages/count/[adminid].tsx
import React from "react";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import { mdiAlphaICircleOutline, mdiPlusCircle, mdiMinusCircle } from "@mdi/js";

import CountPageHeader from "@/src/components/countPageHeader";
import CountPageHero from "@/src/components/countPageHero";
import { IconButton } from "@/src/components/iconButton";
import { Button } from "@/src/components/button";
import { Modal } from "@/src/components/modal";

import useCountPage from "@/src/hooks/useCountPage";

const tooltipStyle: React.CSSProperties = {
  boxShadow: "0.5px 0.5px 10px 0.5px rgba(0, 0, 0, 0.3)",
  borderRadius: 10,
  backgroundColor: "white",
  color: "black",
};

type ViewProps = {
  count: number;
  loadingCount: boolean;
  loadingAction: boolean;
  showModal: boolean;
  infoMode: boolean;
  error: string | null;

  onOpenInfo: () => void;
  onOpenConfirm: () => void;
  onCloseModal: () => void;
  onIncrement: () => void;
  onConfirmDecrement: () => void;
  onSignOut: () => void;
};

function CountPageView({
  count,
  loadingCount,
  loadingAction,
  showModal,
  infoMode,
  error,
  onOpenInfo,
  onOpenConfirm,
  onCloseModal,
  onIncrement,
  onConfirmDecrement,
  onSignOut,
}: ViewProps) {
  const isDecrementDisabled = loadingAction || count <= 0;
  const isIncrementDisabled = loadingAction;

  return (
    <>
      <div>
        <CountPageHeader />
        <div className="flex items-center gap-2 px-4 py-2">
          <Button className="bg-red-500 text-white" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="md:hidden items-center">
          <CountPageHero />
        </div>

        <div id="count-body" className="w-full max-w-[1000px] mt-48 mx-auto">
          <div className="flex items-center justify-between">
            {/* Minus */}
            <div id="IconButton-minus">
              <div className="md:hidden">
                <IconButton
                  data-tooltip-id="tooltip-minus"
                  data-tooltip-content="Delete Entry"
                  data-tooltip-place="top"
                  hoverColor="hover:text-primary-light"
                  disabled={isDecrementDisabled}
                  size={2}
                  path={mdiMinusCircle}
                  iconColor="text-primary"
                  onClick={onOpenConfirm}
                />
              </div>

              <div className="hidden md:block">
                <IconButton
                  data-tooltip-id="tooltip-minus"
                  data-tooltip-content="Delete Entry"
                  data-tooltip-place="top"
                  hoverColor="hover:text-primary-light"
                  disabled={isDecrementDisabled}
                  size={4}
                  path={mdiMinusCircle}
                  iconColor="text-primary"
                  onClick={onOpenConfirm}
                />
              </div>
            </div>

            {/* Count */}
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <p className="md:text-lg">Current Count</p>

                <IconButton
                  data-tooltip-id="tooltip-info"
                  data-tooltip-content="Learn More"
                  data-tooltip-place="top"
                  hoverColor="hover:text-grey-1"
                  size={0.8}
                  path={mdiAlphaICircleOutline}
                  onClick={onOpenInfo}
                />
              </div>

              <div className="mb-10">
                <p className="text-5xl md:text-8xl font-extrabold">
                  {loadingCount ? "…" : count}
                </p>
              </div>

              {error && (
                <div className="text-sm text-red-600 mt-2" role="alert">
                  {error}
                </div>
              )}
            </div>

            {/* Plus */}
            <div id="IconButton-plus">
              <div className="md:hidden">
                <IconButton
                  data-tooltip-id="tooltip-plus"
                  data-tooltip-content="Create Entry"
                  data-tooltip-place="top"
                  hoverColor="hover:text-primary-light"
                  onClick={onIncrement}
                  disabled={isIncrementDisabled}
                  size={2}
                  path={mdiPlusCircle}
                  iconColor="text-primary"
                />
              </div>
              <div className="hidden md:block">
                <IconButton
                  data-tooltip-id="tooltip-plus"
                  data-tooltip-content="Create Entry"
                  data-tooltip-place="top"
                  hoverColor="hover:text-primary-light"
                  onClick={onIncrement}
                  disabled={isIncrementDisabled}
                  size={4}
                  path={mdiPlusCircle}
                  iconColor="text-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        bgColor="bg-white"
        maxWidth="max-w-3xl"
        handleClose={onCloseModal}
      >
        <div className="flex flex-col gap-2 items-center justify-center p-12">
          {infoMode ? (
            <p>
              This application is used to count the vehicles coming into the
              site. It resets at 12 midnight every day.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <p>Are you sure you want to delete this entry?</p>
              <div className="flex items-center justify-center gap-2">
                <Button type="button" onClick={onCloseModal} variant="social">
                  No
                </Button>
                <Button
                  className="bg-primary hover:bg-primary-light text-grey"
                  type="button"
                  onClick={onConfirmDecrement}
                  variant="primary"
                >
                  Yes
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Tooltips */}
      <Tooltip id="tooltip-info" style={tooltipStyle} />
      <Tooltip id="tooltip-minus" style={tooltipStyle} />
      <Tooltip id="tooltip-plus" style={tooltipStyle} />
    </>
  );
}

const CountPage: React.FC = () => {
  const router = useRouter();
  const { adminid } = router.query;

  const {
    count,
    clientData,
    loadingCount,
    loadingAction,
    showModal,
    infoMode,
    error,
    openInfoModal,
    openConfirmModal,
    closeModal,
    increment,
    confirmDecrement,
    signOut,
    refresh,
  } = useCountPage(adminid);

  // redirect to login if no client data found (hook reads storage but redirect here)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("clientData");
    if (!raw) {
      const id = Array.isArray(adminid) ? adminid[0] : adminid;
      router.push(`/login/${id ?? ""}`);
    }
  }, [adminid, router]);

  // handle sign out and then redirect
  const handleSignOut = React.useCallback(() => {
    signOut();
    const id = Array.isArray(adminid) ? adminid[0] : adminid;
    router.push(`/login/${id ?? ""}`);
  }, [adminid, router, signOut]);

  return (
    <CountPageView
      count={count}
      loadingCount={loadingCount}
      loadingAction={loadingAction}
      showModal={showModal}
      infoMode={infoMode}
      error={error}
      onOpenInfo={openInfoModal}
      onOpenConfirm={openConfirmModal}
      onCloseModal={closeModal}
      onIncrement={() => increment().then(() => refresh())}
      onConfirmDecrement={() => confirmDecrement().then(() => refresh())}
      onSignOut={handleSignOut}
    />
  );
};

export default CountPage;
