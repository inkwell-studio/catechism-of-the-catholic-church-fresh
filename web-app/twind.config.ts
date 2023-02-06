import { Options } from '$fresh/plugins/twind.ts';
import { apply } from 'twind';

export default {
    selfURL: import.meta.url,
    preflight: {
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
        html: apply('font-serif'),
        body: {
            h1: apply('font-sans'),
            h2: apply('font-sans'),
            h3: apply('font-sans'),
            h4: apply('font-sans'),
            h5: apply('font-sans'),
            h6: apply('font-sans'),
        }
    },
    theme: {
        fontFamily: {
            sans: ['PTSans', 'sans-serif'],
            'sans-caption': ['PTSansCaption', 'sans-serif'],
            serif: ['PTSerif', 'serif']
        },
    },
} as Options;
