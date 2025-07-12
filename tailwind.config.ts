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
         background: '#1c1b2e',
		 foreground: '#ffffff',
		 card: {
			DEFAULT: '#e9e5d1',
			foreground: '#1c1b2e',
		 },
		 primary: {
			DEFAULT: '#d4af37',
			foreground: '#1c1b2e',
		 },
		 border: '#4a3d28',
		 input: '#e0dbc3',
		 ring: '#d4af37',
		 buttonPrimaryFrom: '#6a00f4',
		 buttonPrimaryTo: '#d000ff',
		 buttonSecondary: '#3a2b64',
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