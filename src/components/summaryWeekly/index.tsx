import React, { FC } from "react";

interface Detail {
  label: string;
  value: string;
}

interface Props {
  subtitle?: string;
  details: Detail[];
  showDailySection?: boolean;
}

const SummaryWeekly: FC<Props> = ({ subtitle, details, showDailySection }) => {
  return (
    <div className="flex flex-col w-full gap-5 p-4 rounded-2xl border-2 border-grey shadow-lg hover:bg-grey">
      <div className="mb-4 mt-2">
        <p className="text-black text-xl font-semibold">Summary</p>
        {subtitle && !showDailySection ? (
          <p className="text-grey-4 text-xs font-semibold">{subtitle}</p>
        ) : null}
      </div>
      {details.map((detail, index) => (
        <div key={index}>
          <div className="flex flex-row justify-between gap-1 text-sm mb-4">
            <p className="text-grey-4 font-medium">{detail.label}</p>
            <p className="font-bold text-black">{detail.value}</p>
          </div>
          {/* Render <hr> only if this is not the last item */}
          {index !== details.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default SummaryWeekly;
