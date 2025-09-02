/**
 * @format
 * @type {import('tailwindcss').Config}
 */

module.exports = {
  content: ["./dist/**/*.{html,js}"],
  theme: {
    extend: {
      fontSize: {
        "fluid-h1": "clamp(2rem, 4vw + 1rem, 4rem)", // 32px → 64px
        "fluid-h2": "clamp(1.75rem, 3vw + 1rem, 3rem)", // 28px → 48px
        "fluid-h3": "clamp(1.5rem, 2.5vw + 0.5rem, 2.5rem)", // 24px → 40px
        "fluid-h4": "clamp(1.25rem, 2vw + 0.5rem, 2rem)", // 20px → 32px
        "fluid-h5": "clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem)", // 18px → 24px
        "fluid-h6": "clamp(1rem, 1vw + 0.5rem, 1.25rem)", // 16px → 20px
        "fluid-p": "clamp(1rem, 1vw + 0.25rem, 1.125rem)", // 16px → 18px
      },
    },
  },
  plugins: [],
};

// tailwind.config.js
module.exports = {};
