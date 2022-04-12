module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'open-sans': '"Open Sans"'
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
