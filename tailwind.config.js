/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: "#0D0D2B",
        "navy-light": "#1A1A3E",
        accent: "#6C63FF",
        "accent-dark": "#4B44CC",
        "accent-light": "#EDE9FF",
        coral: "#FF6B6B",
        mint: "#43E97B",
        gold: "#FFD166",
        surface: "#F7F7FF",
      },
      fontFamily: {
        grotesk: ["SpaceGrotesk_700Bold"],
        "grotesk-medium": ["SpaceGrotesk_500Medium"],
        caveat: ["Caveat_700Bold"],
        sans: ["DMSans_400Regular"],
        "sans-medium": ["DMSans_500Medium"],
        "sans-bold": ["DMSans_700Bold"],
      },
    },
  },
  plugins: [],
};
