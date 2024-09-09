import React, { useEffect, useState } from "react";
import { ICountPage } from "@/src/types";
import CountPageHeader from "@/src/components/countPageHeader";
import CountPageHero from "@/src/components/countPageHero";
import { IconButton } from "@/src/components/iconButton";
import { mdiAlphaICircleOutline } from "@mdi/js";
import { Modal } from "@/src/components/modal";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/router";
import { supabase } from "@/src/utils/supabaseClient";

const CountPage: React.FC<ICountPage> = () => {
  const [showModal, setShowModal] = useState(false);
  // const [infoButton, setInfoButton] = useState(true);
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const { adminid } = router.query;

  useEffect(() => {
    // Fetch the count of entries from Supabase for the current day
    const fetchCount = async () => {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      const { data, error } = await supabase
        .from("count")
        .select("*", { count: "exact" })
        .eq("adminid", adminid)
        .gte("created_at", `${today}T00:00:00.000Z`) // Filter by entries created from the start of today
        .lte("created_at", `${today}T23:59:59.999Z`); // Filter by entries created until the end of today

      if (!error && data) {
        setCount(data.length); // Set count to the number of entries for this adminId and date
      }
    };

    if (adminid) {
      fetchCount();
    }
  }, [adminid, router]);

  const handleSignOut = () => {
    // Clear the client data from localStorage
    localStorage.removeItem("clientData");

    // Redirect to the login page

    router.push(`/login/${adminid ? adminid : ""}`);
  };

  return (
    <>
      <div>
        <CountPageHeader isAdmin={true}></CountPageHeader>
        {/* <Button className="bg-red-500 text-white" onClick={handleSignOut}>
          Sign Out
        </Button> */}
        <div className="md:hidden items-center">
          <CountPageHero></CountPageHero>
        </div>

        <div className="flex flex-col items-center mt-48">
          <div className="flex items-center mb-2">
            <p className="md:text-lg">Current Count</p>

            <IconButton
              data-tooltip-id="tooltip-info"
              data-tooltip-content="Learn More"
              data-tooltip-place="top"
              hoverColor="hover:text-grey-1"
              size={0.8}
              path={mdiAlphaICircleOutline}
              onClick={() => {
                setShowModal(true);
              }}
            ></IconButton>
          </div>

          <div className="mb-10">
            <p className="text-5xl md:text-8xl font-extrabold">{count}</p>
          </div>
        </div>
      </div>
      {/* modal and tooltip */}
      <Modal
        isOpen={showModal}
        bgColor="bg-white"
        maxWidth="max-w-3xl"
        handleClose={() => {
          setShowModal(false);
        }}
      >
        <div className="flex flex-col gap-2 items-center justify-center p-12">
          <p className="">
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
      />{" "}
    </>
  );
};

export default CountPage;
