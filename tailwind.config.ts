import type { Config } from "tailwindcss";
import { colors, gradients } from "./tokens/colors";
import { typography, spacing, borderRadius } from "./tokens";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        // Raw brand palette — use anywhere via e.g. `bg-brand-primary`
        brand: {
          primary: colors.primary,
          secondary: colors.secondary,
          midOrange: colors.midOrange,
          outline: colors.outline,
          alt: colors.alt,
          midForest: colors.midForest,
          accent: colors.accent,
          tan: colors.tan,
          darkGreen: colors.darkGreen,
          light: colors.light,
          white: colors.white,
        },
        // shadcn/ui semantic aliases — driven by CSS vars
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
      },
      fontFamily: {
        sans: typography.fontFamily.primary,
        serif: typography.fontFamily.secondary,
        primary: typography.fontFamily.primary,
        secondary: typography.fontFamily.secondary,
      },
      backgroundImage: {
        "logo-gradient": gradients.logoGradient,
        "green-gradient": gradients.greenGradient,
      },
      borderRadius: {
        ...borderRadius,
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
