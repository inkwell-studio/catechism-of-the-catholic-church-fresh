import { Head } from '$fresh/runtime.ts';
import { defineRoute } from '$fresh/server.ts';
import { JSX } from 'preact';

import { ActionBar } from '../(_components)/action-bar.tsx';
import { Content } from '../(_components)/content.tsx';
import { TableOfContents } from '../(_components)/table-of-contents.tsx';
import Citations from '../(_islands)/citations.tsx';
import CrossReferences from '../(_islands)/cross-references.tsx';

import { getTableOfContents } from '../../../catechism/source/utils/artifacts.ts';
import { getAllLanguages, getLanguageInfo, getNativeLanguageText } from '../../../catechism/source/utils/language.ts';

import { loadContent } from '../../logic/server/rendering.ts';
import { Element, getElementAndPathID } from '../../logic/server/routing.ts';
import { Actions, Selectors } from '../../logic/shared/state.ts';
import { translate } from '../../logic/shared/translation.ts';

export default defineRoute(async (request, context) => {
    const languageInfo = getLanguageInfo(context.params.language);
    if (languageInfo.language && languageInfo.supported) {
        const elementAndPathID = getElementAndPathID(languageInfo.language, context.params.path);
        if (!elementAndPathID) {
            return context.renderNotFound();
        }
        const { element, pathID } = elementAndPathID;

        if (Element.TABLE_OF_CONTENTS === element) {
            Actions.navigation.setCurrentRenderableNode(null);
            const tableOfContents = await getTableOfContents(languageInfo.language);
            return RenderApp(
                <TableOfContents language={languageInfo.language} tableOfContents={tableOfContents}></TableOfContents>,
            );
        } else if (Element.CONTENT === element) {
            if (pathID) {
                const content = await loadContent(languageInfo.language, pathID);
                if (content) {
                    Actions.navigation.setCurrentRenderableNode(pathID);
                    return RenderApp(
                        <>
                            <div class='grid grid-rows-content-with-permanent-footer h-full'>
                                <div class='flex justify-center overflow-y-auto'>
                                    <Content content={content} language={languageInfo.language}></Content>
                                </div>
                                {/* <Citations></Citations> */}
                            </div>
                            <CrossReferences></CrossReferences>
                        </>,
                    );
                } else {
                    Actions.navigation.setCurrentRenderableNode(null);
                    return context.renderNotFound();
                }
            } else {
                Actions.navigation.setCurrentRenderableNode(null);
                return context.renderNotFound();
            }
        }
    } else if (languageInfo.valid) {
        Actions.navigation.setCurrentRenderableNode(null);
        return UnsupportedLanguage(context.params.language);
    } else {
        Actions.navigation.setCurrentRenderableNode(null);
        return context.renderNotFound();
    }
});

function RenderApp(content: JSX.Element): JSX.Element {
    return (
        <>
            <Head>
                <title>{translate('Catechism of the Catholic Church', Selectors.language.value)}</title>
            </Head>
            <body class='grid grid-rows-content-with-permanent-footer h-screen bg-tan-100'>
                <div class='relative overflow-y-auto'>
                    {content}
                </div>
                <div>
                    <ActionBar></ActionBar>
                </div>
            </body>
        </>
    );
}

function UnsupportedLanguage(unsupportedLanguageCode: string): JSX.Element {
    return (
        <div class='p-12'>
            <div>
                {translate('Unsupported language', Selectors.language.value)}:{' '}
                <span class='font-mono'>{unsupportedLanguageCode}</span>
            </div>
            <div class='mt-4'>
                <strong class='font-bold'>
                    {translate('Available languages', Selectors.language.value)}:
                </strong>
                <ul class='list-disc mt-2'>
                    {getAllLanguages().map(([code, _language]) => (
                        <li>
                            {getNativeLanguageText(code)}: <span class='font-mono'>{code}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
