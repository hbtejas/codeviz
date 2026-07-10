/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx,mjs}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  corePlugins: {
    // Disable built-in container to avoid lightningcss issues with 100% breakpoints
    container: false,
  },
  theme: {
    extend: {
      colors: {
        'brand-bg': '#060913',
        'brand-bg-primary': '#0a0f24',
        'brand-bg-secondary': '#0f1730',
        'brand-text': '#f8fafc',
        'brand-text-secondary': '#94a3b8',
        'brand-link': '#38bdf8',
      },
    },
  },
  plugins: [],
};

