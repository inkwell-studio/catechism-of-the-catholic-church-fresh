import {
    CatechismStructure,
    Container,
    Content,
    ContentBase,
    ContentContainer,
    InBriefContainer,
    Language,
    Paragraph,
    PathID,
    RenderableContent,
} from '../catechism/source/types/types.ts';
import { getContentMap } from '../catechism/source/utils/artifacts.ts';
import { hasInBrief } from '../catechism/source/utils/content.ts';
import {
    getContainerInfo,
    getPartialDescendentPathID,
    getRoot,
    getTopNumber,
    hasChildren,
    isPrologueContent,
} from '../catechism/source/utils/path-id.ts';

export async function getContent(language: Language, pathID: PathID): Promise<RenderableContent> {
    try {
        const contentMap = await getContentMap(language);
        return contentMap[pathID];
    } catch (error) {
        throw new Error(`Failed to load content (${language}: ${pathID})`, error);
    }
}

export function getContentForRendering(pathID: PathID, catechism: CatechismStructure): RenderableContent {
    const content = getContentForRenderingHelper(pathID, catechism);
    const crossReferences = getParagraphCrossReferences(content);
    return {
        content,
        crossReferences,
    };
}

function getContentForRenderingHelper(pathID: PathID, catechism: CatechismStructure): ContentContainer {
    // If anything in the Prologue is requested, return the entire Prologue
    const isInPrologue = isPrologueContent(pathID);
    if (isInPrologue) {
        return catechism.prologue;
    } else {
        const partNumber = getTopNumber(pathID);
        const part = catechism.parts[partNumber - 1];

        if (partNumber === Number(pathID)) {
            return trimContentForRendering(part, TrimMode.FULL);
        } else {
            return getDescendentForRendering(part, pathID);
        }
    }
}

enum TrimMode {
    FULL = 'FULL',
    BYPASS = 'BYPASS',
    KEEP_ENDING = 'KEEP_ENDING',
}

function getDescendentForRendering(contentContainer: ContentContainer, pathID: PathID): ContentContainer {
    const { leaf, ancestors, articleTrimMode } = getRenderableLeaf(contentContainer, pathID);
    const content = getGreatestDirectParent(leaf, ancestors);
    return trimContentForRendering(content, articleTrimMode);
}

function getRenderableLeaf(
    potentialLeaf: ContentContainer,
    pathID: PathID,
): { leaf: ContentContainer; ancestors: Array<ContentContainer>; articleTrimMode: TrimMode } {
    const ancestors: Array<ContentContainer> = [];
    let articleTrimMode = TrimMode.FULL;

    let partialPathID = pathID;
    let childExists = hasChildren(partialPathID);
    let renderableLeafReached = isRenderableLeaf(potentialLeaf);

    while (childExists && !renderableLeafReached) {
        ancestors.push(potentialLeaf);

        const nextPartialPathID = getPartialDescendentPathID(partialPathID);
        if (nextPartialPathID) {
            partialPathID = nextPartialPathID;

            // Except for Articles, only the first main child of an item may be a renderable leaf if the item itself is not.
            // The ArticleParagraphs within an Article are renderable leaves so long as they are not the first main child.
            if (!is(Content.ARTICLE, potentialLeaf)) {
                potentialLeaf = getNextChild(potentialLeaf, partialPathID) as ContentContainer;
                renderableLeafReached = isRenderableLeaf(potentialLeaf);
            } else {
                const articleHasMultipleArticleParagraphs = potentialLeaf.mainContent.filter((c) =>
                    is(Content.ARTICLE_PARAGRAPH, c)
                ).length > 1;

                const child = getNextChild(potentialLeaf, partialPathID);
                const isFinalContent = isFinalContentChild(child.pathID);

                if (isFinalContent) {
                    articleTrimMode = articleHasMultipleArticleParagraphs ? TrimMode.KEEP_ENDING : TrimMode.BYPASS;
                } else {
                    if (is(Content.ARTICLE_PARAGRAPH, child)) {
                        if (!articleHasMultipleArticleParagraphs) {
                            articleTrimMode = TrimMode.BYPASS;
                        } else {
                            const isFirstChild = isFirstMainChild(child.pathID);
                            const isLastChild = isLastMainChild(child.pathID, potentialLeaf);
                            const articleHasInBrief = !!(potentialLeaf as InBriefContainer).inBrief;
                            const articleHasFinalContent = potentialLeaf.finalContent.length > 0;

                            if (isFirstChild) {
                                articleTrimMode = TrimMode.FULL;
                            } else if (isLastChild && (articleHasInBrief || articleHasFinalContent)) {
                                articleTrimMode = TrimMode.KEEP_ENDING;
                            } else {
                                potentialLeaf = child as ContentContainer;
                            }
                        }
                    } else if (is(Content.IN_BRIEF, child)) {
                        articleTrimMode = articleHasMultipleArticleParagraphs ? TrimMode.KEEP_ENDING : TrimMode.BYPASS;
                    } else {
                        articleTrimMode = articleHasMultipleArticleParagraphs ? TrimMode.FULL : TrimMode.BYPASS;
                    }
                }
                renderableLeafReached = true;
            }

            childExists = hasChildren(partialPathID);
        } else {
            childExists = false;
        }
    }

    return {
        leaf: potentialLeaf,
        ancestors,
        articleTrimMode,
    };
}

/**
 * @param leaf
 * @param ancestors the list of nodes that are ancestors of `leaf`, in descending order (i.e. the last ancestor in the list is the parent of `leaf`)
 * @returns The highest parent of `leaf` of which `leaf` and all intermediaries are a "direct" descendent of (i.e. the first main-content child). If no such parent exists, `leaf` is returned
 */
function getGreatestDirectParent(leaf: ContentContainer, ancestors: Array<ContentContainer>): ContentContainer {
    let content = leaf;

    let useAncestor = isFirstMainChild(content.pathID);
    while (useAncestor) {
        const ancestor = ancestors.pop();
        if (ancestor) {
            content = ancestor;
            useAncestor = isFirstMainChild(content.pathID);
        } else {
            throw new Error(
                `An ancestor could not be found where expected. PathID: ${content.pathID}`,
            );
        }
    }

    return content;
}

function trimContentForRendering(content: ContentContainer, articleTrimMode: TrimMode): ContentContainer {
    if (TrimMode.BYPASS === articleTrimMode) {
        return content;
    } else {
        return trim(content, articleTrimMode);
    }
}

function trim(content: ContentContainer, articleTrimMode: TrimMode): ContentContainer {
    const shouldTrimContent = contentShouldBeTrimmed(content, articleTrimMode);

    if (shouldTrimContent) {
        content = structuredClone(content);
        trimHelper(content, articleTrimMode);
    }

    return content;

    function trimHelper(c: ContentContainer, articleTrimMode: TrimMode): void {
        if (!is(Content.ARTICLE, c) || TrimMode.FULL === articleTrimMode) {
            // deno-lint-ignore no-explicit-any
            (c as any).mainContent = c.mainContent.slice(0, 1);
            // deno-lint-ignore no-explicit-any
            (c as any).finalContent = [];

            const hasInBriefContent = hasInBrief(c);
            if (hasInBriefContent) {
                // deno-lint-ignore no-explicit-any
                (c as any).inBrief = null;
            }
        } else if (TrimMode.KEEP_ENDING === articleTrimMode) {
            // deno-lint-ignore no-explicit-any
            (c as any).openingContent = [];
            // deno-lint-ignore no-explicit-any
            (c as any).mainContent = c.mainContent.slice(-1);
        }

        const trimContent = contentShouldBeTrimmed(c.mainContent[0] as ContentContainer, articleTrimMode);
        if (trimContent) {
            trimHelper(c.mainContent[0] as ContentContainer, articleTrimMode);
        }
    }
}

function contentShouldBeTrimmed(c: ContentContainer, articleTrimMode: TrimMode): boolean {
    const isHighLevelContent = is(Content.PROLOGUE, c) || is(Content.PART, c);

    const isSectionWithHighLevelContent = is(Content.SECTION, c) &&
        (childIs(Content.CHAPTER, c) || childIs(Content.ARTICLE, c));

    const isChapterWithArticles = is(Content.CHAPTER, c) && childIs(Content.ARTICLE, c);

    const isArticleWithArticleParagraphs = is(Content.ARTICLE, c) && childIs(Content.ARTICLE_PARAGRAPH, c);

    return isHighLevelContent || isSectionWithHighLevelContent || isChapterWithArticles ||
        (isArticleWithArticleParagraphs && TrimMode.BYPASS !== articleTrimMode);
}

/**
 * @param content the parent
 * @param partialPathID the `PathID` of the child, with the beginning portion that is common with the parent omitted
 * @returns the child specified by `partialPathID` of `content`
 */
function getNextChild(content: ContentContainer, partialPathID: PathID): ContentBase {
    const root = getRoot(partialPathID);
    const info: ReturnType<typeof getContainerInfo> = getContainerInfo(root);

    if (info) {
        const container = info.container;
        const index = info.index;

        if (Container.IN_BRIEF === container) {
            const inBrief = (content as InBriefContainer).inBrief;
            if (inBrief) {
                return inBrief;
            } else {
                throw fail();
            }
        } else if (index !== null && index >= 0) {
            switch (container) {
                case Container.OPENING: {
                    return content.openingContent[index];
                }
                case Container.MAIN: {
                    return content.mainContent[index];
                }
                case Container.FINAL: {
                    return content.finalContent[index];
                }
                default: {
                    throw fail();
                }
            }
        } else {
            throw fail();
        }
    } else {
        throw fail();
    }

    function fail(): Error {
        return new Error(
            `Content could not be found. Parent PathID: ${content.pathID}, child info: ${JSON.stringify(info)}`,
        );
    }
}

/**
 * @returns `true` if the content item specified by the PathID is the first child of its parent's main content
 */
function isFirstMainChild(pathID: PathID): boolean {
    const info = getContainerInfo(pathID);
    return info?.container === Container.MAIN && info?.index === 0;
}

/**
 * @returns `true` if the content item specified by the PathID is the last child of its parent's main content
 */
function isLastMainChild(pathID: PathID, parent: ContentContainer): boolean {
    const info = getContainerInfo(pathID);
    return info?.container === Container.MAIN && info?.index === parent.mainContent.length - 1;
}

/**
 * @returns `true` if the content item specified by the PathID is a child of its parent's final content
 */
function isFinalContentChild(pathID: PathID): boolean {
    const info = getContainerInfo(pathID);
    return info?.container === Container.FINAL;
}

/**
 * @returns `true` if the content is a renderable item with no renderable children
 */
function isRenderableLeaf(content: ContentBase): boolean {
    if (is(Content.SECTION, content)) {
        const hasChildChapter = (content as ContentContainer).mainContent.some((child) => is(Content.CHAPTER, child));
        const hasChildArticle = (content as ContentContainer).mainContent.some((child) => is(Content.ARTICLE, child));
        return !hasChildChapter && !hasChildArticle;
    } else if (is(Content.CHAPTER, content)) {
        const hasChildArticle = (content as ContentContainer).mainContent.some((child) => is(Content.ARTICLE, child));
        return !hasChildArticle;
    } else if (is(Content.ARTICLE, content)) {
        const hasNonInitialArticleParagraph = (content as ContentContainer).mainContent.slice(1).some((
            subsequentChild,
        ) => is(Content.ARTICLE_PARAGRAPH, subsequentChild));
        return !hasNonInitialArticleParagraph;
    } else if (is(Content.ARTICLE_PARAGRAPH, content)) {
        const isFirstChild = isFirstMainChild(content.pathID);
        if (isFirstChild) {
            throw new Error(
                `An unexpected content structure was encountered: neither an item or any of its children are renderable leafs. Content type: ${content.contentType}. PathID ${content.pathID}`,
            );
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function is(contentType: Content, content: ContentBase): boolean {
    return content.contentType === contentType;
}

function childIs(contentType: Content, content: ContentContainer): boolean {
    return content.mainContent[0].contentType === contentType;
}

function getParagraphCrossReferences(content: ContentContainer): Array<Paragraph> {
    // TODO: Implement
    return [];
}
