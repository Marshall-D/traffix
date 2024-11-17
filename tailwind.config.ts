import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
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
      error: { dark: "#c2151d", DEFAULT: "#F03738", light: "#ffced4" },
      primary: {
        DEFAULT: "#0056B3",
        light: "#5286BE",
        blue: "#CADEF4",
      },

      black: {
        DEFAULT: "#000000",
      },
      white2: {
        DEFAULT: "#ffffff",
      },
      grey: {
        DEFAULT: "#f3f1f1",
        1: "#6b6a6a",
        2: "#273240",
        3: " #E5E7EB",
      },
    },
  },

  plugins: [require("flowbite/plugin")],
};
export default config;
