/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/layouts/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            ipad: "481px",
            // => @media (min-width: 640px) { ... }
            tablet: "769px",
            // => @media (min-width: 769px) { ... }
            laptop: "1025px",
            // => @media (min-width: 1024px) { ... }
            desktop: "1250px",
            // => @media (min-width: 1024px) { ... }
        },
        extend: {
            transitionProperty: {
                left: "left",
                spacing: "margin, padding",
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false, // <== disable this!
    },
};
