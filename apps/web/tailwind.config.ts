import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          muted: "var(--bg-muted)",
          inverse: "var(--bg-inverse)",
          overlay: "var(--bg-overlay)",
          sidebar: "var(--bg-sidebar)",
          card: "var(--bg-card)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          inverse: "var(--text-inverse)",
          disabled: "var(--text-disabled)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          pressed: "var(--accent-pressed)",
          subtle: "var(--accent-subtle)",
          text: "var(--accent-text)",
        },
        success: {
          DEFAULT: "#2D7D46",
          subtle: "#E8F5E9",
        },
        warning: {
          DEFAULT: "#C17E2F",
          subtle: "#FFF3E0",
        },
        error: {
          DEFAULT: "#C13A31",
          subtle: "#FDECEA",
        },
        info: {
          DEFAULT: "#3B6FCA",
          subtle: "#E3EDFB",
        },
        layer: {
          system: "#6366F1",
          container: "#0EA5E9",
          component: "#10B981",
          code: "#DA7756",
        },
        level: {
          explorer: "#0EA5E9",
          navigator: "#8B5CF6",
          anchor: "#DA7756",
        },
        term: {
          bg: "#1A1915",
          surface: "#252420",
          border: "#3A3832",
          text: "#E8E4DD",
          dim: "#9B9590",
        },
      },
      fontFamily: {
        display: [
          "var(--font-ibm-plex-sans)",
          "IBM Plex Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        body: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "var(--font-ibm-plex-mono)",
          "IBM Plex Mono",
          "SF Mono",
          "Cascadia Code",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(26, 26, 26, 0.04)",
        md: "0 4px 12px rgba(26, 26, 26, 0.08)",
        lg: "0 8px 32px rgba(26, 26, 26, 0.12)",
      },
      spacing: {
        sidebar: "260px",
        "content-max": "1020px",
      },
      maxWidth: {
        content: "1020px",
      },
      keyframes: {
        fadeUp: {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        pageIn: {
          from: { transform: "translateY(6px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
        dropIn: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        toastIn: {
          from: { transform: "translateX(110%)" },
          to: { transform: "translateX(0)" },
        },
        modalIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        flashBorder: {
          "0%, 100%": { borderLeftColor: "currentColor" },
          "50%": {
            boxShadow: "-4px 0 0 0 currentColor, 0 4px 12px rgba(26,26,26,0.08)",
          },
        },
      },
      animation: {
        "fade-up": "fadeUp 400ms cubic-bezier(.22,1,.36,1) both",
        "page-in": "pageIn 260ms cubic-bezier(.22,1,.36,1)",
        spin: "spin 0.7s linear infinite",
        pulse: "pulse 1.5s ease-in-out infinite",
        blink: "blink 1.1s step-end infinite",
        "drop-in": "dropIn 150ms ease-out",
        "toast-in": "toastIn 300ms ease-out",
        "modal-in": "modalIn 200ms ease",
        "flash-border": "flashBorder 800ms ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
