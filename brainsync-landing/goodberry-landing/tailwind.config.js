/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ADHD-friendly color palette
        'adhd-blue': '#3B82F6',
        'adhd-purple': '#8B5CF6', 
        'adhd-green': '#10B981',
        'adhd-orange': '#F59E0B',
        'adhd-pink': '#EC4899',
        'adhd-gray': '#6B7280',
        'adhd-light': '#F8FAFC',
        'adhd-dark': '#1F2937',
      },
      fontFamily: {
        'adhd': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gentle-bounce': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 