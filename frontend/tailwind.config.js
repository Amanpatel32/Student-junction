/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        campus: {
          paper: '#FAF7F0',
          paperDim: '#F1ECDF',
          ink: '#211D18',
          inkSoft: '#5B5346',
          forest: '#5B2A86',
          forestLight: '#7A45AA',
          forestDark: '#3D1A5E',
          gold: '#D9A521',
          goldLight: '#E8C24A',
          goldSoft: '#F5E4B0',
          line: '#DDD4C0',
          green: '#3B7A57',
          greenLight: '#4A9E6E',
          greenSoft: '#DCEAE0',
          red: '#B84C4C',
          redLight: '#D46060',
          redSoft: '#F3DEDE',
          blue: '#2F4B7C',
          blueLight: '#4A6DA8',
          blueSoft: '#DDE6F2',
          teal: '#1E7A72',
          tealSoft: '#DCEEEC',
          orange: '#D4731E',
          orangeSoft: '#F5E0CC',
          // role accent colors
          admin: '#2F4B7C',
          adminSoft: '#DDE6F2',
          teacher: '#1E7A72',
          teacherSoft: '#DCEEEC',
          student: '#B9791E',
          studentSoft: '#F3E5CC',
        },
      },
      fontFamily: {
        display: ['"Lora"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(33,29,24,0.05), 0 8px 24px -14px rgba(33,29,24,0.3)',
        glow: '0 0 20px rgba(91,42,134,0.15)',
        glowGold: '0 0 20px rgba(217,165,33,0.2)',
        'card-hover': '0 8px 30px rgba(33,29,24,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'bounce-in': 'bounceIn 0.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 1.5s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
