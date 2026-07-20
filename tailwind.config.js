/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soft neutrals — rose-tinted, no brown
        nude: {
          50: '#FFFDFD',
          100: '#FFF8FA',
          200: '#F2E7EB',
          300: '#E8D5DC',
          400: '#C4A8B4',
          500: '#9A7A88',
          600: '#6B5560',
          700: '#4A3D45',
          800: '#2B2B2B',
          900: '#1F1F1F',
        },
        // Primary rose / soft pink
        blush: {
          50: '#FFF5F8',
          100: '#FFD8E5',
          200: '#FEC5D8',
          300: '#F9A8C0',
          400: '#F58EA8',
          500: '#E8759A',
          600: '#D45A82',
          700: '#B8446A',
          800: '#963554',
          900: '#7A2A44',
        },
        // Champagne blush accents
        beige: {
          50: '#FFFBF9',
          100: '#FFF0F4',
          200: '#FFE4EC',
          300: '#FFD8E5',
          400: '#FEC5D8',
          500: '#F58EA8',
          600: '#E8759A',
          700: '#D45A82',
          800: '#B8446A',
          900: '#963554',
        },
        // Success green
        sage: {
          50: '#F4FBF6',
          100: '#E4F5EA',
          200: '#C8EBD4',
          300: '#A8DEB8',
          400: '#8BCF9D',
          500: '#6FBA85',
          600: '#569A6B',
          700: '#447A55',
          800: '#366144',
          900: '#2C4E37',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(245, 142, 168, 0.15)',
        premium: '0 12px 40px -12px rgba(245, 142, 168, 0.25)',
        glass: '0 8px 32px rgba(245, 142, 168, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        shimmer: 'shimmer 2s infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};
