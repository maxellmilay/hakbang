import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: '#F7EB25',
                    light: '#FEFDE9',
                    dark: '#AFA71A',
                },
                level: {
                    0: '#E0E0E0', // Light Grey
                    1: '#34C924', // Bright Green
                    2: '#4CE346', // Brighter Forest Green
                    3: '#66FF66', // Bright Lime Green
                    4: '#8DFF5C', // Brighter Light Green
                    5: '#B8FF89', // Brighter Pale Green
                    6: '#D8FFBB', // Very Light Green
                    7: '#FFDB91', // Brighter Light Orange
                    8: '#FFC658', // Brighter Medium Orange
                    9: '#FFA500', // Bright Orange
                    10: '#FF6666', // Brighter Light Red
                    11: '#FF3333', // Bright Red
                    12: '#D10000', // Brighter Dark Red
                },
            },
        },
    },
    plugins: [],
}
export default config
