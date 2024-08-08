import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      // success: { dark: "#006e00", DEFAULT: "#3CC13B", light: "#c8ecc6" },
      // warning: { dark: "#ee7800", DEFAULT: "#F3BB1C", light: "#faf198" },
      error: { dark: "#c2151d", DEFAULT: "#F03738", light: "#ffced4" },
      // transparent: "transparent",
      primary: {
        DEFAULT: "#0056B3",
        light: "#5286BE",
      },

      black: {
        DEFAULT: "#000000",
      },
      grey: {
        DEFAULT: "#f3f1f1",
      },
    },
  },

  plugins: [],
};
export default config;
