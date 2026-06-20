import type { Config } from 'tailwindcss';

const config: Config = {
  // Enforcing dark mode via the HTML class strategy
  darkMode: 'class', 
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Utilizing a sleek, productivity-focused slate palette
        background: '#0f172a', // slate-900 for main background
        surface: '#1e293b',    // slate-800 for card layers
      },
    },
  },
  plugins: [], // Note: @tailwindcss/forms plugin is often highly recommended here for cleaner inputs
};
export default config;
