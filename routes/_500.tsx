import { ErrorPageProps } from '$fresh/server.ts';
import { JSX } from 'preact';

import { state } from '../web/state.ts';
import { translate } from '../web/translation.ts';

type Error = {
    message: string;
};

export default function ErrorPage500(props: ErrorPageProps): JSX.Element {
    return (
        <div class='h-[70vh] flex flex-col justify-center'>
            <div class='bg-tan-50 flex flex-col justify-center items-center gap-4 py-40 shadow-lg sm:(gap-6 px-40 mx-auto rounded-lg)'>
                <h1 class='font-mono text-4xl italic'>{translate('Server Error', state.value.language)}</h1>
                <div class='space-y-2'>
                    <div>{translate('Error:', state.value.language)}</div>
                    <pre>
                        {(props.error as Error).message}
                    </pre>
                </div>
                <strong class='font-bold text-xl md:text-2xl'>
                    <a href='/' class='hover:underline'>{translate('Go Home', state.value.language)}</a>
                </strong>
            </div>
        </div>
    );
}
