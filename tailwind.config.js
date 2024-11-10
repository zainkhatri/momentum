/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',        // Include all files in the 'app' directory
    './pages/**/*.{js,ts,jsx,tsx}',      // Include if you have a 'pages' directory
    './components/**/*.{js,ts,jsx,tsx}', // Include all files in the 'components' directory
    './contexts/**/*.{js,ts,jsx,tsx}',   // Include context providers
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
