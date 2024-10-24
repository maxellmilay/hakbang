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
                    0: '#D3D3D3',
                    1: '#0B6623', // Dark Green
                    2: '#228B22', // Forest Green
                    3: '#32CD32', // Lime Green
                    4: '#70F915', // Light Green
                    5: '#A9F97B', // Pale Green
                    6: '#CAF9AB', // Very Light Green
                    7: '#FBD08F', // Light Orange
                    8: '#FFB347', // Medium Orange
                    9: '#FF8C00', // Dark Orange
                    10: '#FF8282', // Light Red
                    11: '#F91515', // Bright Red
                    12: '#8B0000', // Dark Red
                },
            },
        },
    },
    plugins: [],
}
export default config
