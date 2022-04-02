module.exports = {
  content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'primary-light': '#79E567',
      primary: '#6ACC5A',
      'primary-dark': '#5EB850',
      'gray-100': '#F3FAF2',
      'gray-200': '#B9C2B8',
      'gray-300': '#929B90',
      'gray-400': '#585E57',
    },
    fontFamily: {
      sans: ['Comfortaa', 'sans-serif'],
      serif: ['WindSong', 'serif'],
    },
    extend: {
      transitionProperty: {
        width: 'width',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
