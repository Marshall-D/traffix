import React, { FC } from "react";
import CircularIcon from "../circularIcon";

interface Props {
  selectedDate?: string | null;
}

const BusiestDay: FC<Props> = ({ selectedDate }) => {
  const dayOfWeek = selectedDate
    ? new Date(selectedDate)
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase()
    : "MON";

  const fullDayName = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" })
    : "Monday";

  return (
    <div className="flex flex-row w-full justify-between  rounded-2xl p-4 px-8  border-2 border-grey gap-32 shadow-lg hover:bg-grey">
      <div>
        <p className="text-sm text-grey-4  font-semibold ">Busiest Day</p>
        <p className="font-semibold text-lg text-black-2">
          {fullDayName}{" "}
          <span className="font-medium text-green text-sm"> +55%</span>
        </p>
      </div>
      <div>
        <CircularIcon day={dayOfWeek}></CircularIcon>
      </div>
    </div>
  );
};

export default BusiestDay;

// import React, { FC } from "react";
// import CircularIcon from "../circularIcon";

// interface Props {
//   busiestDay: { day: string; count: number; date: string };
// }

// const BusiestDay: FC<Props> = ({ busiestDay }) => {
//   return (
//     <div className="flex flex-row w-full justify-between  rounded-2xl p-4 px-8  border-2 border-grey gap-32 shadow-lg hover:bg-grey">
//       <div>
//         <p className="text-sm text-grey-4  font-semibold ">Busiest Day</p>
//         <p className="font-semibold text-lg text-black-2">
//           {busiestDay.day}{" "}
//           <span className="font-medium text-green text-sm">
//             {" "}
//             {busiestDay.count} counts
//           </span>
//         </p>
//       </div>
//       <div>
//         <CircularIcon day={busiestDay.day.substring(0, 3).toUpperCase()} />
//       </div>
//     </div>
//   );
// };

// export default BusiestDay;
