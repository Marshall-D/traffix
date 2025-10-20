// src/components/countStatsCard/index.tsx

import React, { FC } from "react";

interface Props {
  title?: string;
  value?: string | number | null;
  /**
   * When true, value is treated as a percentage. If value is numeric it will be formatted
   * and a trailing % will be appended. If value is a string that already contains "%",
   * it will be rendered as-is.
   */
  isPercentage?: boolean;
  /**
   * Optional explicit trend override. If omitted and isPercentage is true, trend is
   * inferred from the numeric value: >0 => "up", <0 => "down", 0 => "neutral".
   */
  trend?: "up" | "down" | "neutral" | null;
  /**
   * Optional className to allow additional styling from parent
   */
  className?: string;
}

const upArrow = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
  >
    <path d="M12 5l7 7h-4v7h-6v-7H5l7-7z" />
  </svg>
);

const downArrow = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
  >
    <path d="M12 19l-7-7h4V5h6v7h4l-7 7z" />
  </svg>
);

const CountStatsCard: FC<Props> = ({
  title,
  value,
  isPercentage = false,
  trend: trendProp = null,
  className = "",
}) => {
  // helper to parse numeric value from various inputs (commas, % signs, plus/minus)
  const parseNumeric = (v?: string | number | null): number | null => {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    // remove commas and percent and whitespace
    const cleaned = String(v).replace(/,/g, "").replace("%", "").trim();
    // remove trailing plus sign
    const cleaned2 = cleaned.replace(/\+$/, "");
    const n = parseFloat(cleaned2);
    return Number.isNaN(n) ? null : n;
  };

  // decide trend
  const numericValue = parseNumeric(value);
  const inferredTrend =
    trendProp ??
    (isPercentage && numericValue !== null
      ? numericValue > 0
        ? "up"
        : numericValue < 0
        ? "down"
        : "neutral"
      : null);

  // color classes for trend
  const trendColorClass =
    inferredTrend === "up"
      ? "text-green-500"
      : inferredTrend === "down"
      ? "text-red-500"
      : "text-black";

  // build the display value
  let displayValue = "";
  if (value === null || value === undefined || value === "") {
    displayValue = "—";
  } else if (isPercentage) {
    // if string already contains %, respect it
    if (typeof value === "string" && value.includes("%")) {
      displayValue = value;
    } else if (numericValue !== null) {
      // format number with up to 2 decimal places if needed, include thousands separators
      const formatted =
        Math.abs(numericValue) >= 1000
          ? numericValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
          : numericValue.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            });
      displayValue = `${formatted}%`;
    } else {
      // fallback to raw string
      displayValue = String(value);
      // append % if user didn't include one
      if (!displayValue.includes("%")) displayValue = `${displayValue}%`;
    }
  } else {
    // non-percentage: display as-is but format numbers nicely
    if (numericValue !== null) {
      displayValue = numericValue.toLocaleString();
    } else {
      displayValue = String(value);
    }
  }

  return (
    <div
      className={`flex flex-col w-full justify-center items-center rounded-2xl p-9 border-2 border-grey gap-4 shadow-lg hover:bg-grey ${className}`}
    >
      <p className="text-sm text-grey-2">{title}</p>

      <div className="flex items-center gap-3">
        {/* Arrow (left of value) */}
        {inferredTrend === "up" && (
          <span className={`${trendColorClass} flex items-center`}>
            {upArrow}
          </span>
        )}
        {inferredTrend === "down" && (
          <span className={`${trendColorClass} flex items-center`}>
            {downArrow}
          </span>
        )}

        <p
          className={`font-medium text-4xl ${
            inferredTrend === "up" || inferredTrend === "down"
              ? `${trendColorClass}`
              : "text-black"
          }`}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
};

export default CountStatsCard;
