//pages/admin/count/[adminid].tsx
import React from "react";
import { useRouter } from "next/router";
import CountPageHeader from "@/src/components/countPageHeader";
import CountPageHero from "@/src/components/countPageHero";
import DashboardHeader from "@/src/components/dashboardHeader";
import { IconButton } from "@/src/components/iconButton";
import { mdiAlphaICircleOutline } from "@mdi/js";
import { Modal } from "@/src/components/modal";
import { Tooltip } from "react-tooltip";
import useAdminCount from "@/src/hooks/useAdminCount";

const AdminCountPage: React.FC = () => {
  const router = useRouter();
  const { adminid } = router.query;
  const adminId = Array.isArray(adminid) ? adminid[0] : adminid ?? null;

  const { count, loading, error } = useAdminCount(adminId);
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <div>
        <div className="hidden lg:block">
          <CountPageHeader isAdmin />
        </div>

        <div className="lg:hidden mb-36 lg:mb-0 ">
          <DashboardHeader title="Count" admin={adminId} />
        </div>

        <div className="lg:hidden items-center">
          <CountPageHero />
        </div>

        <div className="flex flex-col items-center mt-48">
          <div className="flex items-center mb-2">
            <p className="lg:text-lg">Current Count</p>

            <IconButton
              data-tooltip-id="tooltip-info"
              data-tooltip-content="Learn More"
              data-tooltip-place="top"
              hoverColor="hover:text-grey-1"
              size={0.8}
              path={mdiAlphaICircleOutline}
              onClick={() => setShowModal(true)}
            />
          </div>

          <div className="mb-10">
            {loading ? (
              <p className="text-3xl lg:text-6xl font-medium">Loading…</p>
            ) : error ? (
              <p className="text-xl text-red-600">Could not load count</p>
            ) : (
              <p className="text-5xl lg:text-8xl font-extrabold">{count}</p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        bgColor="bg-white"
        maxWidth="max-w-3xl"
        handleClose={() => setShowModal(false)}
      >
        <div className="flex flex-col gap-2 items-center justify-center p-12">
          <p>
            This application is used to count the vehicles coming into the site.
            It resets at 12 midnight every day.
          </p>
        </div>
      </Modal>

      <Tooltip
        style={{
          boxShadow: "0.5px 0.5px 10px 0.5px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
          backgroundColor: "white",
          color: "black",
        }}
        id="tooltip-info"
      />
    </>
  );
};

export default AdminCountPage;
