import { UnknownPageProps } from '$fresh/server.ts';
import { JSX } from 'preact';

import { Error } from './(_components)/error.tsx';
import { Selectors } from '../web/state.ts';
import { translate } from '../web/translation.ts';

export default function ErrorPage404(props: UnknownPageProps): JSX.Element {
    const title = translate('Page not found.', Selectors.language.value);

    return (
        <Error title={title} titleClass='font-serif'>
            <div>
                {translate('Unknown page:', Selectors.language.value)}{' '}
                <span class='font-mono'>{props.url.pathname}</span>
            </div>
        </Error>
    );
}
