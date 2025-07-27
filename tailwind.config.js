/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Premium Fintech Colors
        electric: {
          DEFAULT: "hsl(var(--electric-blue))",
          dark: "hsl(var(--electric-blue-dark))",
        },
        cyan: {
          bright: "hsl(var(--cyan-bright))",
        },
        purple: {
          electric: "hsl(var(--purple-electric))",
        },
        gold: {
          accent: "hsl(var(--gold-accent))",
        },
        navy: {
          deep: "hsl(var(--navy-deep))",
          medium: "hsl(var(--navy-medium))",
          light: "hsl(var(--navy-light))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-electric": "linear-gradient(135deg, hsl(var(--electric-blue)) 0%, hsl(var(--cyan-bright)) 100%)",
        "gradient-purple": "linear-gradient(135deg, hsl(var(--purple-electric)) 0%, hsl(var(--electric-blue)) 100%)",
        "gradient-gold": "linear-gradient(135deg, hsl(var(--gold-accent)) 0%, hsl(var(--electric-blue)) 100%)",
        "gradient-dark": "linear-gradient(135deg, hsl(var(--navy-deep)) 0%, hsl(var(--navy-medium)) 100%)",
      },
      boxShadow: {
        glow: "0 0 20px hsla(var(--electric-blue), 0.3)",
        "glow-purple": "0 0 20px hsla(var(--purple-electric), 0.3)",
        "glow-gold": "0 0 20px hsla(var(--gold-accent), 0.3)",
        premium: "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.1)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      backdropBlur: {
        glass: "16px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          from: { boxShadow: "0 0 20px hsla(var(--electric-blue), 0.2)" },
          to: { boxShadow: "0 0 30px hsla(var(--electric-blue), 0.4)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
