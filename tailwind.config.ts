import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#28325c",
        foreground: "#ffffff",
        card: {
          DEFAULT: "#f1ecce",
          foreground: "#f1ecce",
        },
        popover: {
          DEFAULT: "#46351D",
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#a16207",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#3f2600",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#404c6b",
          foreground: "#cccccc",
        },
        accent: {
          DEFAULT: "#facc15",
          foreground: "#1f1f1f",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#fef2f2",
        },
        border: "#46351D",
        input: "#3b4a73",
        ring: "#332500",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;