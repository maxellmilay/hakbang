import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend_coordinates: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: '#F7EB25',
                    light: '#FEFDE9',
                    dark: '#AFA71A',
                },
                level: {
                    1: '#70F915',
                    2: '#CAF9AB',
                    3: '#FBD08F',
                    4: '#FF8282',
                    5: '#F91515',
                },
            },
        },
    },
    plugins: [],
}
export default config
