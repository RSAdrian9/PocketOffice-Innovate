/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'ion-primary': 'var(--ion-color-primary)',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

