// src/types/charts.ts

// i dont think these are being used for now.
export type ReadonlySeries = {
  label?: string;
  data?: readonly number[];
  backgroundColor?: string;
  borderColor?: string;
};

export type ReadonlyLabels = readonly string[];
export type ChartTitle = string | readonly string[];
