/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mint: "#7FD8BE",
        "mint-soft": "#A8E6CF",
        "mint-light": "#EAFBF5",
        lavender: "#C9B8E8",
        "lavender-deep": "#8B6FCE",
        navy: "#1B1F3B",
        sage: "#5FA88F",
        coral: "#E8917A",
      },
    },
  },
  plugins: [],
};
