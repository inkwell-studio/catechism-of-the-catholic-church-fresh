import { Head } from '$fresh/runtime.ts';
import { AppProps } from '$fresh/server.ts';
import { JSX } from 'preact';

import { getLanguageTag } from '../web/language-tag.ts';
import { Selectors } from '../web/state.ts';

export default function App({ Component }: AppProps): JSX.Element {
    return (
        <html lang={getLanguageTag(Selectors.language.value)}>
            <Head>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>
            <Component />
        </html>
    );
}
