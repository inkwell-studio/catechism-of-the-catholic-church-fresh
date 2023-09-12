import { defineRoute } from '$fresh/server.ts';
import { JSX } from 'preact';

import { ActionBar } from '../(_components)/action-bar.tsx';
import { ContentContainer } from '../(_components)/content-container.tsx';
import { TableOfContents } from '../(_components)/table-of-contents.tsx';

import { getTableOfContents } from '../../catechism/source/utils/artifacts.ts';
import { getAllLanguages, getLanguageInfo, getNativeLanguageText } from '../../catechism/source/utils/language.ts';

import { getContent } from '../../web/rendering.ts';
import { Element, getElementAndPathID } from '../../web/routing.ts';
import { state } from '../../web/state.ts';
import { translate } from '../../web/translation.ts';

export default defineRoute(async (request, context) => {
    const languageInfo = getLanguageInfo(context.params.language);
    if (languageInfo.language && languageInfo.supported) {
        const elementAndPathID = getElementAndPathID(languageInfo.language, context.params.path);
        if (!elementAndPathID) {
            return context.renderNotFound();
        }
        const { element, pathID } = elementAndPathID;

        let mainElement = <></>;
        if (Element.TABLE_OF_CONTENTS === element) {
            const tableOfContents = await getTableOfContents(languageInfo.language);
            mainElement = (
                <TableOfContents language={languageInfo.language} tableOfContents={tableOfContents}></TableOfContents>
            );
        } else if (Element.CONTENT === element) {
            if (pathID) {
                const content = await getContent(languageInfo.language, pathID);
                mainElement = <ContentContainer language={languageInfo.language} content={content}></ContentContainer>;
            } else {
                return context.renderNotFound();
            }
        }

        return (
            <div class='flex flex-col'>
                {mainElement}
                {
                    /*
                {
                <div>
                    <ActionBar></ActionBar>
                </div>
                }
                */
                }
            </div>
        );
    } else if (languageInfo.valid) {
        return UnsupportedLanguage(context.params.language);
    } else {
        return context.renderNotFound();
    }
});

function UnsupportedLanguage(unsupportedLanguageCode: string): JSX.Element {
    return (
        <div class='p-12'>
            <div>
                {translate('Unsupported language', state.value.language)}:{' '}
                <span class='font-mono'>{unsupportedLanguageCode}</span>
            </div>
            <div class='mt-4'>
                <strong className='font-bold'>
                    {translate('Available languages', state.value.language)}:
                </strong>
                <ul class='list-disc mt-2'>
                    {getAllLanguages().map(([code, _language]) => (
                        <li>
                            {getNativeLanguageText(code)}: <span className='font-mono'>{code}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
