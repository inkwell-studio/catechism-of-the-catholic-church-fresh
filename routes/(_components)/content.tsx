import { JSX } from 'preact';

import ContentBase from '../(_islands)/content-base.tsx';
import { Error } from '../(_components)/error.tsx';
import { Selectors } from '../../web/state.ts';
import { translate } from '../../web/translation.ts';

export function Content(): JSX.Element {
    const content = Selectors.content.active.value;
    const language = Selectors.language.value;

    if (content) {
        return (
            <main class='
                h-[fit-content]
                relative bg-tan-50 text-justify
                rounded-md shadow md:shadow-2xl
                w-full md:max-w-2xl lg:max-w-3xl
                px-6 xs:px-10 sm:px-20 lg:px-32
                pb-4 pt-4 sm:pt-8 md:pt-14 md:my-8 lg:pt-16'>
                <ContentBase content={content} language={language}></ContentBase>
            </main>
        );
    } else {
        const title = translate('Error: No content found.', Selectors.language.value);
        return (
            <Error title={title} titleClass='font-serif'>
                <></>
            </Error>
        );
    }
}
