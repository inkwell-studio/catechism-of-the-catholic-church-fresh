import { ErrorPageProps } from '$fresh/server.ts';
import { JSX } from 'preact';

import { Error } from './(_components)/error.tsx';
import { Selectors } from '../web/state.ts';
import { translate } from '../web/translation.ts';

type Error = {
    message: string;
};

export default function ErrorPage500(props: ErrorPageProps): JSX.Element {
    const title = translate('Server Error', Selectors.language.value);

    return (
        <Error title={title} titleClass='font-mono'>
            <div class='space-y-2'>
                <div>{translate('Error:', Selectors.language.value)}</div>
                <pre>
                    {(props.error as Error).message}
                </pre>
            </div>
        </Error>
    );
}
