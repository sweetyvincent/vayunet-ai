/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#0B0F17",
        darkcard: "#131C2E",
        darkborder: "#1E2D4A",
        vayuGreen: "#10B981",
        vayuYellow: "#F59E0B",
        vayuOrange: "#F97316",
        vayuRed: "#EF4444",
        vayuPurple: "#8B5CF6",
        vayuMaroon: "#881337"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
