/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E14",
        panel: "#12161F",
        panel2: "#171C27",
        line: "#232937",
        amber: {
          DEFAULT: "#FFB020",
          dim: "#C98A1F",
          soft: "#FFD98A",
        },
        mint: "#35D07F",
        coral: "#FF5D5D",
        ink2: "#F5F6F8",
        muted: "#8A93A6",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(245,246,248,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(245,246,248,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      boxShadow: {
        board: "0 20px 60px -20px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(255,176,32,0.25), 0 0 40px rgba(255,176,32,0.08)",
      },
      keyframes: {
        flap: {
          "0%": { transform: "rotateX(0deg)" },
          "48%": { transform: "rotateX(-90deg)" },
          "50%": { transform: "rotateX(-90deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.2,0.7,0.2,1) both",
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
