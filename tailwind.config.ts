import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(20, 184, 166, 0.14), 0 16px 38px rgba(7, 22, 33, 0.3)",
      },
      backgroundImage: {
        "hero-aurora":
          "radial-gradient(circle at 15% 20%, rgba(45, 212, 191, 0.25), transparent 32%), radial-gradient(circle at 85% 8%, rgba(59, 130, 246, 0.3), transparent 40%), linear-gradient(140deg, #020617 0%, #0f172a 42%, #082f49 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
