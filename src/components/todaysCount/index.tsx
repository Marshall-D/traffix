import React, { FC } from "react";

interface Props {
  /** Today's count (e.g. from GET /api/v1/counts/today). */
  count?: number;
  /** Optional comparison text, e.g. "+12% vs same time yesterday". Only shown when provided. */
  comparisonText?: string | null;
}

const TodaysCount: FC<Props> = ({ count, comparisonText }) => {
  return (
    <div className="flex flex-row w-full  rounded-2xl p-4 px-8 border-2 border-grey gap-32 shadow-lg hover:bg-grey">
      <div>
        <p className="text-sm text-grey-4 font-semibold">Todays Count</p>
        <p className="font-semibold text-lg text-black-2">
          {count ?? "—"}
          {comparisonText ? (
            <span className="font-medium text-green text-sm ml-1">
              {comparisonText}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
};

export default TodaysCount;
