/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'nav-bg': '#1C1C1C',
      'nav-bg-hover': '#1f1f1f',
      'dark-26': '#262626',
      'dark-28': '#282828',
      'dark-32': '#3a3a3a',
      'dark-34': '#343434',
      'gray-6e': '#6E6E6E',
      'gray-b8': '#B8B8B8',
      'gray-c8': '#C8C8C8',
      'gray-40': '#404040',
      'gray-56': '#565656',
      'almost-white': '#e8e8e8',
      'white': '#FFFFFF',
      'cyan': '#47E8E8',
      'blue': '#1575b2',
      'green': '#1FE4B4',
      'red': '#DF4A65',
      'red-21': '#a21a40',
      'orange-1': '#FFE15A',
      'orange-2': '#F4BE37',
    }
  },
  plugins: [],
}