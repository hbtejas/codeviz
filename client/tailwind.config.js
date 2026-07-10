/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx,mjs}",
    "../node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx,mjs}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [require("@relume_io/relume-tailwind")],
  theme: {
    extend: {},
  },
  plugins: [],
};
