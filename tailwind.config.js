/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'tablet': { 'min': '600px', 'max': '1024px' }, // Custom breakpoint for tablets
        'below-1042': { 'max': '1041px' }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
