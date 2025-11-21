/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#e6007e',
        'primary-light': '#ff1a94',
        background: '#000000',
        card: '#1a1a1a',
        border: '#333333',
        text: '#ffffff',
        'text-secondary': '#999999',
        'input-background': '#0a0a0a',
        error: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
      },
    },
  },
  plugins: [],
}