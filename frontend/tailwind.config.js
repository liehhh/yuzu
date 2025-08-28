/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      borderRadius: { glass: "22px" },
      boxShadow: {
        glass: "0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
      },
    },
  },
  plugins: [],
};