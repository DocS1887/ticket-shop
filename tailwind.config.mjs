/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        '128': '32rem',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'accent': 'var(--accent-color)',
        'foreground-light': 'var(--foreground-light)',
        'header': 'var(--header)',
      },
    },
  },
  plugins: [],
};
