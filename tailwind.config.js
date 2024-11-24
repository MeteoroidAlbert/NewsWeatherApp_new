module.exports = {
  content: ["./src/**/*.{jsx,js}"], 
  theme: {
    extend: {
      animation: {
        "slide-right": "slideRight 0.3s ease-in",
        "slide-left": "slideLeft 0.3s ease-in",
        "slide-bottom": "slideBottom 0.3s ease-in", 
      },
      keyframes: {
        slideRight: {
          "0%": { transform: "translateX(100%)" }, 
          "100%": { transform: "translateX(0)" }, 
        },
        slideLeft: {
          "0%": { transform: "translateX(-100%)" }, 
          "100%": { transform: "translateX(0)" }, 
        },
        slideBottom: {
          "0%": { transform: "translateY(100%)" }, 
          "100%": { transform: "translateY(0)" }, 
        },
      },
    },
  },
  plugins: [],
};

