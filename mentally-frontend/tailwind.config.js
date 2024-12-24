/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths as needed
  ],
  theme: {
    extend: {
      colors: {
        clay: "#F1F1F2",
        lightBlue: "#A1D6E2",
        darkBlue: "#1895AD",
        dimGrey: "#6D6D6D", // Adding dimGrey
        lightGrey: "#D3D3D3",
        lavendar: "#D8B9F2",
        mint: "#A8E6CF",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Ensure Inter font is added
      },
      animation: {
        fadeInUp: 'fadeInUp 3.0s ease-out forwards', // Adjusted for smoothness and removed 'backwards'
        fadeInDown: 'fadeInDown 3.0s ease-out forwards', // Ensure the fadeInDown animation is unique
        fadeOutUp: 'fadeOutUp 0.5s ease-out forwards', // Make sure it finishes completely
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(100px)' }, // Start with opacity 0 and slightly below
          '100%': { transform: 'translateY(0)' }, // End with opacity 1 and normal position
        },
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-100px)' }, // Start with opacity 0 and slightly above
          '100%': { transform: 'translateY(0)' }, // End with opacity 1 and normal position
        },
        fadeOutUp: {
          '0%': { transform: 'translateY(0)' }, // Start with full opacity and normal position
          '100%': { opacity: 0, transform: 'translateY(-20px)' }, // End with opacity 0 and slightly upwards
        }
      },
      
    },
  },
  plugins: [],
};
