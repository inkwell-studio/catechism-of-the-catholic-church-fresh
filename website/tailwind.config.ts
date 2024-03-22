import { type Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme.js';

export default {
    content: [
        '{routes,islands,components}/**/*.{ts,tsx}',
    ],
    darkMode: 'class',
    theme: {
        colors: {
            black: '#000',
            purple: {
                '900': '#0f1f6b',
            },
            red: {
                '50': 'hsl(24, 45%, 20%, 15%)',
                '900': 'hsl(24, 45%, 20%)',
            },
            tan: {
                '50': 'hsl(36, 71%, 94%)',
                '100': 'hsl(36, 29%, 83%)',
            },
            white: '#fff',
        },
        fontFamily: {
            // See `styles.css` for the `@font-face` definitions
            sans: ['PTSans', ...defaultTheme.fontFamily.sans],
            'sans-caption': ['PTSansCaption', ...defaultTheme.fontFamily.sans],
            serif: ['PTSerif', ...defaultTheme.fontFamily.serif],
            mono: ['Courier New', 'monospace'],
        },
        extend: {
            aria: {
                // For active link styling
                'current-true': 'current="true"', // ancestor pages
                'current-page': 'current="page"', // current page
            },
            gridTemplateRows: {
                'content-with-permanent-footer': '1fr max-content',
            },
            screens: {
                xs: '320px',
            },
        },
    },
} satisfies Config;
