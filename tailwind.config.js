/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#121212",
                "primary-foreground": "#ffffff",
                "accent-gold": "#C5A059",
                "background-light": "#FAFAFA",
                "background-dark": "#1A1A1A",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                'lg': '0.5rem',
            }
        },
    },
    plugins: [],
}
