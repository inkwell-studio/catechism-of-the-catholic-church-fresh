import { Partial } from '$fresh/runtime.ts';
import { defineRoute, RouteContext } from '$fresh/server.ts';
import { ComponentChildren, JSX } from 'preact';

import { App } from '../(_components)/app.tsx';
import { Content } from '../(_components)/content.tsx';
import { ContentStart } from '../(_components)/content-start.tsx';
import { NavigationButton } from '../(_components)/navigation-button.tsx';
import { PartialEnum } from '../(_components)/partial-enum.ts';
import { TableOfContents } from '../(_components)/table-of-contents.tsx';
import { UnsupportedLanguage } from '../(_components)/unsupported-language.tsx';

import AutoScroller from '../(_islands)/auto-scroller.tsx';

import { loadContent } from '../../logic/server/rendering.ts';
import { Element, getElementAndPathID } from '../../logic/server/routing.ts';
import { Actions } from '../../logic/shared/state.ts';

import { ContentContainer, Language, PathID, TableOfContentsType } from '../../../catechism/source/types/types.ts';
import { getTableOfContents } from '../../../catechism/source/utils/artifacts.ts';
import { getLanguageInfo } from '../../../catechism/source/utils/language.ts';

export default defineRoute(async (request, context) => {
    const result = await parseRoute(context.params.path, context.params.language);

    if (result.language) {
        if (result.content && result.pathID) {
            return (
                <Render pathID={result.pathID} isPartial={context.isPartial}>
                    <Content content={result.content} language={result.language} />
                </Render>
            );
        } else if (result.tableOfContents) {
            return (
                <Render pathID={null} isPartial={context.isPartial}>
                    <TableOfContents tableOfContents={result.tableOfContents} language={result.language} />
                </Render>
            );
        } else {
            return renderNotFound(context);
        }
    } else if ('unsupported-language' === result.error) {
        Actions.navigation.setCurrentRenderableNode(null);
        return <UnsupportedLanguage languageCode={context.params.language} />;
    } else {
        return renderNotFound(context);
    }
});

async function parseRoute(path: string, languageParam: string): Promise<{
    language: Language | null;
    pathID: PathID | null;
    content: ContentContainer | null;
    tableOfContents: TableOfContentsType | null;
    error: 'invalid-path' | 'unsupported-language' | null;
}> {
    const languageInfo = getLanguageInfo(languageParam);
    if (languageInfo.language && languageInfo.supported) {
        const elementAndPathID = getElementAndPathID(languageInfo.language, path);
        if (elementAndPathID) {
            const { element, pathID } = elementAndPathID;
            if (Element.TABLE_OF_CONTENTS === element) {
                const tableOfContents = await getTableOfContents(languageInfo.language);
                return {
                    language: languageInfo.language,
                    pathID: null,
                    content: null,
                    tableOfContents,
                    error: null,
                };
            } else if (Element.CONTENT === element) {
                if (pathID) {
                    const content = await loadContent(languageInfo.language, pathID);
                    if (content) {
                        return {
                            language: languageInfo.language,
                            pathID,
                            content,
                            tableOfContents: null,
                            error: null,
                        };
                    }
                }
            }
        }
    } else if (languageInfo.valid) {
        return {
            language: null,
            pathID: null,
            content: null,
            tableOfContents: null,
            error: 'unsupported-language',
        };
    }

    return {
        language: null,
        pathID: null,
        content: null,
        tableOfContents: null,
        error: 'invalid-path',
    };
}

function Render(props: { children: ComponentChildren; pathID: PathID | null; isPartial: boolean }): JSX.Element {
    Actions.navigation.setCurrentRenderableNode(props.pathID);

    if (props.isPartial) {
        return (
            <>
                <Partial name={PartialEnum.CONTENT_MAIN}>
                    <ContentStart />
                    {props.children}
                </Partial>
                <Partial name={PartialEnum.NAVIGATION_BUTTON_NEXT}>
                    <NavigationButton direction='next' />
                </Partial>
                <Partial name={PartialEnum.NAVIGATION_BUTTON_PREVIOUS}>
                    <NavigationButton direction='previous' />
                </Partial>
            </>
        );
    } else {
        return (
            <>
                <App>
                    <ContentStart />
                    {props.children}
                </App>
                <AutoScroller />
            </>
        );
    }
}

function renderNotFound(context: RouteContext<void, unknown>): Response | Promise<Response> {
    Actions.navigation.setCurrentRenderableNode(null);
    return context.renderNotFound();
}
