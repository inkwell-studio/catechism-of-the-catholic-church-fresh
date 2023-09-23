import { UnknownPageProps } from '$fresh/server.ts';
import { JSX } from 'preact';

import { Selectors } from '../web/state.ts';
import { translate } from '../web/translation.ts';

export default function ErrorPage404(props: UnknownPageProps): JSX.Element {
    return (
        <div class='h-[70vh] flex flex-col justify-center'>
            <div class='bg-tan-50 flex flex-col justify-center items-center gap-4 py-40 shadow-lg sm:(gap-6 px-40 mx-auto rounded-lg)'>
                <h1 class='font-serif text-4xl italic'>{translate('Page not found.', Selectors.language.value)}</h1>
                <div>
                    {translate('Unknown page:', Selectors.language.value)}{' '}
                    <span class='font-mono'>{props.url.pathname}</span>
                </div>

                <strong class='font-bold text-xl md:text-2xl'>
                    <a href='/' class='hover:underline'>{translate('Go Home', Selectors.language.value)}</a>
                </strong>
            </div>
        </div>
    );
}
