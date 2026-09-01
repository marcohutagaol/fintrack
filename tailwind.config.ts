import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#163826",
          foreground: "#ffffff",
          container: "#2d4f3c",
          fixed: "#c5ecd2",
          "fixed-dim": "#a9cfb7",
        },
        secondary: {
          DEFAULT: "#456648",
          foreground: "#ffffff",
          container: "#c3e9c3",
          "on-container": "#1c3a1f",
          fixed: "#c6ecc6",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
          container: "#ffdad6",
          "on-container": "#93000a",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          "on-container": "#93000a",
        },
        surface: {
          DEFAULT: "#f8f9fa",
          dim: "#d9dadb",
          bright: "#f8f9fa",
          variant: "#e1e3e4",
          "container-lowest": "#ffffff",
          "container-low": "#f3f4f5",
          container: "#edeeef",
          "container-high": "#e7e8e9",
          "container-highest": "#e1e3e4",
        },
        "on-background": "#191c1d",
        "on-surface": "#191c1d",
        "on-surface-variant": "#424843",
        "outline-variant": "#c1c8c1",
        outline: "#727973",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#163826",
        chart: {
          "1": "#163826",
          "2": "#456648",
          "3": "#52b788",
          "4": "#e07a5f",
          "5": "#ba1a1a",
          "6": "#f4a261",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
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
