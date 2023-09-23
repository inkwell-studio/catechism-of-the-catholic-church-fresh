import { Head } from '$fresh/runtime.ts';
import { defineRoute } from '$fresh/server.ts';
import { JSX } from 'preact';

import { ActionBar } from '../(_components)/action-bar.tsx';
import { Content } from '../(_components)/content.tsx';
import { TableOfContents } from '../(_components)/table-of-contents.tsx';
import Citations from '../(_islands)/citations.tsx';
import CrossReferences from '../(_islands)/cross-references.tsx';

import { getTableOfContents } from '../../catechism/source/utils/artifacts.ts';
import { getAllLanguages, getLanguageInfo, getNativeLanguageText } from '../../catechism/source/utils/language.ts';

import { loadRenderableContent } from '../../web/rendering.ts';
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

        if (Element.TABLE_OF_CONTENTS === element) {
            const tableOfContents = await getTableOfContents(languageInfo.language);
            return RenderApp(
                <TableOfContents language={languageInfo.language} tableOfContents={tableOfContents}></TableOfContents>,
            );
        } else if (Element.CONTENT === element) {
            if (pathID) {
                const renderableContent = await loadRenderableContent(languageInfo.language, pathID);

                return RenderApp(
                    <>
                        <div class='grid grid-rows-content-with-permanent-footer h-full'>
                            <div class='flex justify-center overflow-y-auto'>
                                <Content content={renderableContent.content} language={languageInfo.language}></Content>
                            </div>
                            <Citations></Citations>
                        </div>
                        {/* deno-fmt-ignore */}
                        <CrossReferences paragraphs={renderableContent.crossReferences} language={languageInfo.language}></CrossReferences>
                    </>,
                );
            } else {
                return context.renderNotFound();
            }
        }
    } else if (languageInfo.valid) {
        return UnsupportedLanguage(context.params.language);
    } else {
        return context.renderNotFound();
    }
});

function RenderApp(mainElement: JSX.Element): JSX.Element {
    return (
        <>
            <Head>
                <title>{translate('Catechism of the Catholic Church', state.value.language)}</title>
            </Head>
            <body class='grid grid-rows-content-with-permanent-footer h-screen bg-tan-100'>
                <div class='overflow-y-auto'>
                    {mainElement}
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
