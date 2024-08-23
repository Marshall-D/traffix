// import React, { useEffect, useState } from "react";
// import classNames from "classnames";
// import { ICountPage } from "@/src/types";
// import { Button } from "@/src/components/button";
// import CountPageHeader from "@/src/components/countPageHeader";
// import CountPageHero from "@/src/components/countPageHero";
// import { IconButton } from "@/src/components/iconButton";
// import { mdiAlphaICircleOutline, mdiPlusCircle, mdiMinusCircle } from "@mdi/js";
// import { Modal } from "@/src/components/modal";
// import { Tooltip } from "react-tooltip";
// import { useRouter } from "next/router";
// import { supabase } from "@/src/utils/supabaseClient";

// const CountPage: React.FC<ICountPage> = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [infoButton, setInfoButton] = useState(true);
//   const [count, setCount] = useState<number>(0);
//   const router = useRouter();
//   const { adminid } = router.query;
//   const [clientData, setClientData] = useState<any>(null);

//   useEffect(() => {
//     // Fetch client data from localStorage
//     const storedClientData = localStorage.getItem("clientData");
//     if (storedClientData) {
//       setClientData(JSON.parse(storedClientData));
//     } else {
//       // Redirect to login if no client data is found
//       router.push(`/login/${adminid}`);
//     }

//     // Fetch the count of entries from Supabase
//     const fetchCount = async () => {
//       const { data, error } = await supabase
//         .from("count")
//         .select("*", { count: "exact" })
//         .eq("adminid", adminid);

//       if (!error && data) {
//         setCount(data.length); // Set count to the number of entries for this adminId
//       }
//     };

//     if (adminid) {
//       fetchCount();
//     }
//   }, [adminid, router]);

//   const handleIncrement = async () => {
//     if (clientData && adminid) {
//       const { clientid } = clientData;

//       const { data, error } = await supabase
//         .from("count")
//         .insert([{ adminid, clientid: clientid }]);

//       if (!error) {
//         setCount((prevCount) => prevCount + 1); // Increment the count state
//       } else {
//         console.error("Error inserting count entry:", error.message);
//       }
//     }
//   };

//   const confirmDecrement = async () => {
//     if (clientData && adminid) {
//       const { data, error } = await supabase
//         .from("count")
//         .select("countid")
//         .eq("adminid", adminid)
//         .order("created_at", { ascending: false })
//         .limit(1);

//       if (data && data.length > 0) {
//         const { countid } = data[0];

//         const { error: deleteError } = await supabase
//           .from("count")
//           .delete()
//           .eq("countid", countid);

//         if (!deleteError) {
//           setCount((prevCount) => Math.max(prevCount - 1, 0)); // Decrement the count state
//         } else {
//           console.error("Error deleting count entry:", deleteError.message);
//         }
//       } else {
//         console.error("No entries found to delete");
//       }
//     }

//     setShowModal(false);
//   };

//   const cancelDecrement = () => {
//     setShowModal(false);
//   };

//   return (
//     <>
//       <div>
//         <CountPageHeader></CountPageHeader>

//         <div className="md:hidden items-center">
//           <CountPageHero></CountPageHero>
//         </div>

//         <div id="count-body" className="w-full max-w-[1000px] mt-48 mx-auto">
//           <div className="flex items-center justify-between">
//             <div id="IconButton-minus">
//               <div className="md:hidden">
//                 <IconButton
//                   data-tooltip-id="tooltip-minus"
//                   data-tooltip-content="Delete Entry"
//                   data-tooltip-place="top"
//                   hoverColor="hover:text-primary-light"
//                   disabled={count === 0}
//                   size={2}
//                   path={mdiMinusCircle}
//                   iconColor="text-primary"
//                   onClick={() => {
//                     setInfoButton(false), setShowModal(true);
//                   }}
//                 ></IconButton>{" "}
//               </div>{" "}
//               <div className="hidden md:block">
//                 <IconButton
//                   data-tooltip-id="tooltip-minus"
//                   data-tooltip-content="Delete Entry"
//                   data-tooltip-place="top"
//                   hoverColor="hover:text-primary-light"
//                   disabled={count === 0}
//                   size={4}
//                   path={mdiMinusCircle}
//                   iconColor="text-primary"
//                   onClick={() => {
//                     setInfoButton(false), setShowModal(true);
//                   }}
//                 ></IconButton>{" "}
//               </div>
//             </div>

//             <div className="flex flex-col items-center">
//               <div className="flex items-center mb-2">
//                 <p className="md:text-lg">Current Count</p>

//                 <IconButton
//                   data-tooltip-id="tooltip-info"
//                   data-tooltip-content="Learn More"
//                   data-tooltip-place="top"
//                   hoverColor="hover:text-grey-1"
//                   size={0.8}
//                   path={mdiAlphaICircleOutline}
//                   onClick={() => {
//                     setInfoButton(true), setShowModal(true);
//                   }}
//                 ></IconButton>
//               </div>

//               <div className="mb-10">
//                 <p className="text-5xl md:text-8xl font-extrabold">{count}</p>
//               </div>
//             </div>

//             <div id="IconButton-plus">
//               <div className="md:hidden">
//                 <IconButton
//                   data-tooltip-id="tooltip-plus"
//                   data-tooltip-content="Create Entry"
//                   data-tooltip-place="top"
//                   hoverColor="hover:text-primary-light"
//                   onClick={handleIncrement}
//                   size={2}
//                   path={mdiPlusCircle}
//                   iconColor="text-primary"
//                 ></IconButton>{" "}
//               </div>{" "}
//               <div className="hidden md:block">
//                 <IconButton
//                   data-tooltip-id="tooltip-plus"
//                   data-tooltip-content="Create Entry"
//                   data-tooltip-place="top"
//                   hoverColor="hover:text-primary-light"
//                   onClick={handleIncrement}
//                   size={4}
//                   path={mdiPlusCircle}
//                   iconColor="text-primary"
//                 ></IconButton>{" "}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* modal and tooltip */}
//       <Modal
//         isOpen={showModal}
//         bgColor="bg-white"
//         maxWidth="max-w-3xl"
//         handleClose={() => {
//           setShowModal(false);
//         }}
//       >
//         <div className="flex flex-col gap-2 items-center justify-center p-12">
//           {infoButton && (
//             <p className="">
//               This application is used to count the vehicles coming into the
//               site. It resets at 12 midnight every day.
//             </p>
//           )}

//           {!infoButton && (
//             <div className="flex flex-col gap-2">
//               <p>Are you sure you want to delete this entry?</p>
//               <div className="flex items-center justify-center gap-2">
//                 <Button
//                   type="submit"
//                   onClick={cancelDecrement}
//                   variant="social"
//                 >
//                   No
//                 </Button>
//                 <Button
//                   className="bg-primary hover:bg-primary-light text-grey"
//                   type="submit"
//                   onClick={confirmDecrement}
//                   variant="primary"
//                 >
//                   Yes
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </Modal>
//       <Tooltip
//         style={{
//           boxShadow: "5px 5px 10px 2px rgba(0,0,0,.8)",
//           borderRadius: "10px",
//           backgroundColor: "white",
//           color: "black",
//         }}
//         id="tooltip-info"
//       />{" "}
//       <Tooltip
//         style={{
//           boxShadow: "5px 5px 10px 2px rgba(0,0,0,.8)",
//           borderRadius: "10px",
//           backgroundColor: "white",
//           color: "black",
//         }}
//         id="tooltip-minus"
//       />{" "}
//       <Tooltip
//         style={{
//           boxShadow: "5px 5px 10px 2px rgba(0,0,0,.8)",
//           borderRadius: "10px",
//           backgroundColor: "white",
//           color: "black",
//         }}
//         id="tooltip-plus"
//       />
//     </>
//   );
// };

// export default CountPage;

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { ICountPage } from "@/src/types";
import { Button } from "@/src/components/button";
import CountPageHeader from "@/src/components/countPageHeader";
import CountPageHero from "@/src/components/countPageHero";
import { IconButton } from "@/src/components/iconButton";
import { mdiAlphaICircleOutline, mdiPlusCircle, mdiMinusCircle } from "@mdi/js";
import { Modal } from "@/src/components/modal";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/router";
import { supabase } from "@/src/utils/supabaseClient";

const CountPage: React.FC<ICountPage> = () => {
  const [showModal, setShowModal] = useState(false);
  const [infoButton, setInfoButton] = useState(true);
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const { adminid } = router.query;
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    // Fetch client data from localStorage
    const storedClientData = localStorage.getItem("clientData");
    if (storedClientData) {
      setClientData(JSON.parse(storedClientData));
    } else {
      // Redirect to login if no client data is found
      router.push(`/login/${adminid}`);
    }

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

  const handleIncrement = async () => {
    if (clientData && adminid) {
      const { clientid } = clientData;

      const { data, error } = await supabase
        .from("count")
        .insert([{ adminid, clientid: clientid }]);

      if (!error) {
        setCount((prevCount) => prevCount + 1); // Increment the count state
      } else {
        console.error("Error inserting count entry:", error.message);
      }
    }
  };

  const confirmDecrement = async () => {
    if (clientData && adminid) {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      const { data, error } = await supabase
        .from("count")
        .select("countid")
        .eq("adminid", adminid)
        .gte("created_at", `${today}T00:00:00.000Z`) // Filter by entries created from the start of today
        .lte("created_at", `${today}T23:59:59.999Z`) // Filter by entries created until the end of today
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const { countid } = data[0];

        const { error: deleteError } = await supabase
          .from("count")
          .delete()
          .eq("countid", countid);

        if (!deleteError) {
          setCount((prevCount) => Math.max(prevCount - 1, 0)); // Decrement the count state
        } else {
          console.error("Error deleting count entry:", deleteError.message);
        }
      } else {
        console.error("No entries found to delete");
      }
    }

    setShowModal(false);
  };

  const cancelDecrement = () => {
    setShowModal(false);
  };

  const handleSignOut = () => {
    // Clear the client data from localStorage
    localStorage.removeItem("clientData");

    // Redirect to the login page

    router.push(`/login/${adminid ? adminid : ""}`);
  };

  return (
    <>
      <div>
        <CountPageHeader></CountPageHeader>
        <Button className="bg-red-500 text-white" onClick={handleSignOut}>
          Sign Out
        </Button>
        <div className="md:hidden items-center">
          <CountPageHero></CountPageHero>
        </div>

        <div id="count-body" className="w-full max-w-[1000px] mt-48 mx-auto">
          <div className="flex items-center justify-between">
            <div id="IconButton-minus">
              <div className="md:hidden">
                <IconButton
                  data-tooltip-id="tooltip-minus"
                  data-tooltip-content="Delete Entry"
                  data-tooltip-place="top"
                  hoverColor="hover:text-primary-light"
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
                  data-tooltip-id="tooltip-minus"
                  data-tooltip-content="Delete Entry"
                  data-tooltip-place="top"
                  hoverColor="hover:text-primary-light"
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

                <IconButton
                  data-tooltip-id="tooltip-info"
                  data-tooltip-content="Learn More"
                  data-tooltip-place="top"
                  hoverColor="hover:text-grey-1"
                  size={0.8}
                  path={mdiAlphaICircleOutline}
                  onClick={() => {
                    setInfoButton(true), setShowModal(true);
                  }}
                ></IconButton>
              </div>

              <div className="mb-10">
                <p className="text-5xl md:text-8xl font-extrabold">{count}</p>
              </div>
            </div>

            <div id="IconButton-plus">
              <div className="md:hidden">
                <IconButton
                  data-tooltip-id="tooltip-plus"
                  data-tooltip-content="Create Entry"
                  data-tooltip-place="top"
                  hoverColor="hover:text-primary-light"
                  onClick={handleIncrement}
                  size={2}
                  path={mdiPlusCircle}
                  iconColor="text-primary"
                ></IconButton>{" "}
              </div>{" "}
              <div className="hidden md:block">
                <IconButton
                  data-tooltip-id="tooltip-plus"
                  data-tooltip-content="Create Entry"
                  data-tooltip-place="top"
                  hoverColor="hover:text-primary-light"
                  onClick={handleIncrement}
                  size={4}
                  path={mdiPlusCircle}
                  iconColor="text-primary"
                ></IconButton>{" "}
              </div>
            </div>
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
          {infoButton && (
            <p className="">
              This application is used to count the vehicles coming into the
              site. It resets at 12 midnight every day.
            </p>
          )}

          {!infoButton && (
            <div className="flex flex-col gap-2">
              <p>Are you sure you want to delete this entry?</p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="submit"
                  onClick={cancelDecrement}
                  variant="social"
                >
                  No
                </Button>
                <Button
                  className="bg-primary hover:bg-primary-light text-grey"
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
      <Tooltip
        style={{
          boxShadow: "5px 5px 10px 2px rgba(0,0,0,.8)",
          borderRadius: "10px",
          backgroundColor: "white",
          color: "black",
        }}
        id="tooltip-info"
      />{" "}
      <Tooltip
        style={{
          boxShadow: "5px 5px 10px 2px rgba(0,0,0,.8)",
          borderRadius: "10px",
          backgroundColor: "white",
          color: "black",
        }}
        id="tooltip-minus"
      />{" "}
      <Tooltip
        style={{
          boxShadow: "5px 5px 10px 2px rgba(0,0,0,.8)",
          borderRadius: "10px",
          backgroundColor: "white",
          color: "black",
        }}
        id="tooltip-plus"
      />
    </>
  );
};

export default CountPage;
