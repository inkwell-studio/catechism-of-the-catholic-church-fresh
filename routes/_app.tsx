import { AppProps } from '$fresh/server.ts';
import { JSX } from 'preact';

import { getLanguageTag } from '../web/language-tag.ts';
import { state } from '../web/state.ts';

export default function App({ Component }: AppProps): JSX.Element {
    return (
        <html lang={getLanguageTag(state.value.language)}>
            <Component />
        </html>
    );
}
