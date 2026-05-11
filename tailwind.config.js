/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slateInk: "#172033",
        mutedLine: "#e6e9ef",
        paper: "#f7f8fb"
      },
      boxShadow: {
        panel: "0 12px 40px rgba(23, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};
