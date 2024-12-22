// import React from "react";

// const CircularIcon = () => {
//   return (
//     <div className="flex items-center justify-center w-10 h-10 bg-primary-blue rounded-full">
//       <div className="flex items-center justify-center w-6 h-4 bg-white">
//         <p className="text-primary font-bold text-[7px]">MON</p>
//       </div>
//     </div>
//   );
// };

// export default CircularIcon;

import React from "react";

const CircularIcon: React.FC<{ day: string }> = ({ day }) => {
  return (
    <div className="flex items-center justify-center w-10 h-10 bg-primary-blue rounded-full">
      <div className="flex items-center justify-center w-6 h-4 bg-white">
        <p className="text-primary font-bold text-[7px]">{day}</p>
      </div>
    </div>
  );
};

export default CircularIcon;
