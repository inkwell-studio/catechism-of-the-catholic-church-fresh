import { defineConfig, Preset } from 'https://esm.sh/@twind/core@1.1.3';
import presetAutoprefix from 'https://esm.sh/@twind/preset-autoprefix@1.0.7';
import presetTailwind from 'https://esm.sh/@twind/preset-tailwind@1.1.4';

export default {
    ...defineConfig({
        presets: [presetTailwind() as Preset, presetAutoprefix()],
        preflight: {
            html: {
                '@apply': 'font-serif text-base text-red-900',
            },
            body: {
                h1: { '@apply': 'font-sans' },
                h2: { '@apply': 'font-sans' },
                h3: { '@apply': 'font-sans' },
                h4: { '@apply': 'font-sans' },
                h5: { '@apply': 'font-sans' },
                h6: { '@apply': 'font-sans' },
            },
            '@font-face': [
                {
                    fontFamily: 'PTSans',
                    src: 'url(/fonts/PTSans-Regular.ttf) format("truetype")',
                },
                {
                    fontFamily: 'PTSans',
                    fontWeight: 'bold',
                    src: 'url(/fonts/PTSans-Bold.ttf) format("truetype")',
                },
                {
                    fontFamily: 'PTSansCaption',
                    src: 'url(/fonts/PTSansCaption-Regular.ttf) format("truetype")',
                },
                {
                    fontFamily: 'PTSerif',
                    src: 'url(/fonts/PTSerif-Regular.ttf) format("truetype")',
                },
                {
                    fontFamily: 'PTSerif',
                    fontStyle: 'italic',
                    src: 'url(/fonts/PTSerif-Italic.ttf) format("truetype")',
                },
                {
                    fontFamily: 'PTSerif',
                    fontWeight: 'bold',
                    src: 'url(/fonts/PTSerif-Bold.ttf) format("truetype")',
                },
                {
                    fontFamily: 'PTSerif',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    src: 'url(/fonts/PTSerif-BoldItalic.ttf) format("truetype")',
                },
            ],
        },
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
                sans: ['PTSans', 'sans-serif'],
                'sans-caption': ['PTSansCaption', 'sans-serif'],
                serif: ['PTSerif', 'serif'],
                mono: ['Courier New', 'monospace'],
            },
            extend: {
                fontSize: {
                    'base': ['16px', '1.5rem'],
                },
                screens: {
                    xs: '320px',
                },
            },
        },
    }),
    selfURL: import.meta.url,
};
