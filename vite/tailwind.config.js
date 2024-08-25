/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "error-color": "#FF453A",
        "success-color": "#22C55E",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
