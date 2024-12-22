import React, { FC, useState } from "react";
import BusiestDay from "../busiestDay";
import ProfileCard from "../profileCard";
import SideNav from "../sidenav";

interface Props {
  title?: string;
  admin?: any;
  showDailySection?: boolean;
}

const DashboardHeader: FC<Props> = ({ title, admin, showDailySection }) => {
  const [isTitleVisible, setIsTitleVisible] = useState(true);

  const handleToggleMenu = (isOpen: boolean) => {
    setIsTitleVisible(!isOpen); // Toggle the title visibility
  };

  return (
    <>
      <div className="flex w-full pt-12  lg:pt-0 lg:mt-16 lg:my-8  fixed lg:static  top-0 z-[999]  bg-white pb-4 px-4 justify-between border-b border-b-grey lg:border-b-0 shadow-lg lg:shadow-none  ">
        <div className="flex gap-6">
          <SideNav admin={admin} onToggleMenu={handleToggleMenu}></SideNav>
          <div className="flex flex-col">
            {showDailySection && (
              <div
                className={`text-sm text-black-2 font-medium mt-1  transition-opacity duration-500 ease-in-out ${
                  isTitleVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <p>
                  <span className="text-grey-4">Weekly</span> / Count details
                </p>
              </div>
            )}
            <p className="text-lg my-2">{title}</p>
            {showDailySection && <BusiestDay></BusiestDay>}
          </div>
        </div>
        <div>
          <ProfileCard></ProfileCard>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;

// import React, { FC, useState } from "react";
// import BusiestDay from "../busiestDay";
// import ProfileCard from "../profileCard";
// import SideNav from "../sidenav";

// interface Props {
//   title?: string;
//   admin?: any;
//   showDailySection?: boolean;
//   selectedDate?: string | null;
// }

// const DashboardHeader: FC<Props> = ({
//   title,
//   admin,
//   showDailySection,
//   selectedDate,
// }) => {
//   const [isTitleVisible, setIsTitleVisible] = useState(true);

//   const handleToggleMenu = (isOpen: boolean) => {
//     setIsTitleVisible(!isOpen); // Toggle the title visibility
//   };

//   return (
//     <>
//       <div className="flex w-full pt-12  lg:pt-0 lg:mt-16 lg:my-8  fixed lg:static  top-0 z-[999]  bg-white pb-4 px-4 justify-between border-b border-b-grey lg:border-b-0 shadow-lg lg:shadow-none  ">
//         <div className="flex gap-6">
//           <SideNav admin={admin} onToggleMenu={handleToggleMenu}></SideNav>
//           <div className="flex flex-col">
//             {showDailySection && (
//               <div
//                 className={`text-sm text-black-2 font-medium mt-1  transition-opacity duration-500 ease-in-out ${
//                   isTitleVisible ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 <p>
//                   <span className="text-grey-4">Weekly</span> / Count details
//                 </p>
//               </div>
//             )}
//             <p className="text-lg my-2">{title}</p>
//             {showDailySection && (
//               <BusiestDay selectedDate={selectedDate}></BusiestDay>
//             )}
//           </div>
//         </div>
//         <div>
//           <ProfileCard></ProfileCard>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashboardHeader;

// import React, { FC, useState } from "react";
// import BusiestDay from "../busiestDay";
// import ProfileCard from "../profileCard";
// import SideNav from "../sidenav";

// interface Props {
//   title?: string;
//   admin?: any;
//   showDailySection?: boolean;
//   selectedDate?: string | null;
//   busiestDay?: { day: string; count: number; date: string }; // Updated Props
// }

// const DashboardHeader: FC<Props> = ({
//   title,
//   admin,
//   showDailySection,
//   selectedDate,
//   busiestDay,
// }) => {
//   const [isTitleVisible, setIsTitleVisible] = useState(true);

//   const handleToggleMenu = (isOpen: boolean) => {
//     setIsTitleVisible(!isOpen); // Toggle the title visibility
//   };

//   return (
//     <>
//       <div className="flex w-full pt-12  lg:pt-0 lg:mt-16 lg:my-8  fixed lg:static  top-0 z-[999]  bg-white pb-4 px-4 justify-between border-b border-b-grey lg:border-b-0 shadow-lg lg:shadow-none  ">
//         <div className="flex gap-6">
//           <SideNav admin={admin} onToggleMenu={handleToggleMenu}></SideNav>
//           <div className="flex flex-col">
//             {showDailySection && (
//               <div
//                 className={`text-sm text-black-2 font-medium mt-1  transition-opacity duration-500 ease-in-out ${
//                   isTitleVisible ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 <p>
//                   <span className="text-grey-4">Weekly</span> / Count details
//                 </p>
//               </div>
//             )}
//             <p className="text-lg my-2">{title}</p>
//             {showDailySection && busiestDay && (
//               <BusiestDay busiestDay={busiestDay}></BusiestDay>
//             )}
//           </div>
//         </div>
//         <div>
//           <ProfileCard></ProfileCard>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashboardHeader;
