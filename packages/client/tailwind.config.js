/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: 'var(--terminal-bg)',
          fg: 'var(--terminal-fg)',
          cursor: 'var(--terminal-cursor)',
          selection: 'var(--terminal-selection)',
        },
      },
    },
  },
  plugins: [],
};
