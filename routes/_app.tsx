import { Head } from '$fresh/runtime.ts';
import { AppProps } from '$fresh/server.ts';
import { JSX } from 'preact';

import { getLanguageTag } from '../web/language-tag.ts';
import { state } from '../web/state.ts';
import { translate } from '../web/translation.ts';

export default function App({ Component }: AppProps): JSX.Element {
    return (
        <html lang={getLanguageTag(state.value.language)}>
            <Head>
                <title>{translate('Catechism of the Catholic Church', state.value.language)}</title>
            </Head>
            <body class='min-h-screen bg-tan-100'>
                <Component />
            </body>
        </html>
    );
}
