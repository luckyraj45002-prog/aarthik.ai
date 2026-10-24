/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          charcoal: '#111827',
          purple: '#6D28D9',
          purpleLight: '#8B5CF6',
          purpleDark: '#5B21B6',
        },
        warm: {
          50: '#FDFBF7',
          100: '#F7F2EA',
          150: '#EFE8DC',
          200: '#E6DACB',
          300: '#D5C3AD',
          400: '#B89B7E',
          500: '#9B7452',
          600: '#7E5A3D',
          700: '#64442E',
          800: '#4D3322',
          900: '#342116',
          950: '#23150D',
        },
        canvas: '#F8F4EC',
        card: '#FFFFFF',
      },
      boxShadow: {
        'clay': '10px 14px 28px rgba(168, 140, 118, 0.18), -8px -8px 20px rgba(255, 255, 255, 0.95), inset 1px 1px 2px rgba(255, 255, 255, 0.9), inset -2px -2px 4px rgba(160, 130, 105, 0.12)',
        'clay-hover': '12px 18px 34px rgba(168, 140, 118, 0.24), -10px -10px 24px rgba(255, 255, 255, 1), inset 1px 1px 2px rgba(255, 255, 255, 0.9)',
        'clay-sm': '6px 8px 16px rgba(168, 140, 118, 0.15), -5px -5px 12px rgba(255, 255, 255, 0.9)',
        'clay-lg': '16px 24px 40px rgba(150, 120, 95, 0.2), -12px -12px 30px rgba(255, 255, 255, 0.95)',
        'clay-btn': '6px 8px 18px rgba(109, 40, 217, 0.35), -4px -4px 10px rgba(255, 255, 255, 0.7), inset 1px 1px 2px rgba(255, 255, 255, 0.4)',
        'clay-btn-warm': '6px 8px 18px rgba(126, 90, 61, 0.25), -4px -4px 10px rgba(255, 255, 255, 0.8), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
        'clay-inset': 'inset 3px 4px 8px rgba(160, 135, 115, 0.22), inset -3px -3px 8px rgba(255, 255, 255, 0.95)',
        'clay-pressed': 'inset 2px 3px 6px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
    },
  },
  plugins: [],
}
