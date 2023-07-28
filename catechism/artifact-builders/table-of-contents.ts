import { CatechismStructure } from '../source/types/catechism-structure.ts';
import {
    Article,
    ArticleParagraph,
    buildSemanticPath,
    Chapter,
    Content,
    ContentBase,
    ContentContainer,
    Paragraph,
    ParagraphGroup,
    Part,
    Section,
    SemanticPathSource,
    Subarticle,
    TableOfContentsEntry,
    TableOfContentsType,
} from '../source/types/types.ts';
import { getInBrief, getMainContent, getParagraphs } from '../utils.ts';

//#region builders
export function build(catechism: CatechismStructure): TableOfContentsType {
    return {
        prologue: buildEntry(catechism.prologue, [], true),
        parts: catechism.parts.map((part) => buildEntry(part, [])),
    };
}

function buildEntry(
    content: ContentBase | ContentContainer,
    ancestors: Array<SemanticPathSource>,
    forceIncludeChildren = false,
): TableOfContentsEntry {
    const semanticPathSource = getSemanticPathSource(content);
    const { firstParagraphNumber, lastParagraphNumber } = getTerminalParagraphNumbers(content);

    return {
        contentType: content.contentType,
        title: getTitle(content),
        pathID: content.pathID,
        semanticPath: buildSemanticPath(semanticPathSource, ancestors),
        firstParagraphNumber,
        lastParagraphNumber,
        children: buildChildEntries(content, [...ancestors, semanticPathSource], forceIncludeChildren),
    };
}

function buildChildEntries(
    parent: ContentBase | ContentContainer,
    ancestors: Array<SemanticPathSource>,
    forceIncludeChildren = false,
): Array<TableOfContentsEntry> {
    const childEntries = getMainContent(parent)
        .filter((child) => forceIncludeChildren || shouldGenerateChildEntry(parent, child))
        .map((child) => buildEntry(child, ancestors));

    const inBrief = getInBrief(parent);
    if (inBrief) {
        childEntries.push(buildEntry(inBrief, ancestors));
    }

    return childEntries;
}
//#endregion

//#region helpers
/**
 * @returns `true` if a table-of-contents entry should be generated for the provided parent-child pairing, and `false` otherwise
 */
function shouldGenerateChildEntry(parent: ContentBase, child: ContentBase): boolean {
    // A list of [parent, child] pairings that will trigger the generation of a table-of-contents entry for the child
    return [
        [Content.PART, Content.SECTION],
        [Content.SECTION, Content.CHAPTER],
        [Content.SECTION, Content.ARTICLE],
        [Content.CHAPTER, Content.ARTICLE],
        [Content.CHAPTER, Content.SUB_ARTICLE],
        [Content.ARTICLE, Content.ARTICLE_PARAGRAPH],
        [Content.ARTICLE, Content.SUB_ARTICLE],
    ].some((validPairing) => parent.contentType === validPairing[0] && child.contentType === validPairing[1]);
}

function getTitle(content: ContentBase): string {
    const number = getSemanticPathSource(content).number;
    const numberSuffix = number ? ` ${number}` : '';

    // Replace underscores with spaces and implement title-casing
    return `${Content[content.contentType]}${numberSuffix}`
        .replaceAll('SUB_ARTICLE', 'SUBARTICLE')
        .toLowerCase()
        .split('_')
        .map((part) => part.substring(0, 1).toUpperCase() + part.substring(1))
        .join(' ');
}

function getSemanticPathSource(content: ContentBase): SemanticPathSource {
    return {
        content: content.contentType,
        number: getNumber(content),
    };
}

function getNumber(content: ContentBase): number | null {
    if (Content.PART === content.contentType) {
        return (content as unknown as Part).partNumber;
    } else if (Content.SECTION === content.contentType) {
        return (content as unknown as Section).sectionNumber;
    } else if (Content.CHAPTER === content.contentType) {
        return (content as unknown as Chapter).chapterNumber;
    } else if (Content.ARTICLE === content.contentType) {
        return (content as unknown as Article).articleNumber;
    } else if (Content.ARTICLE_PARAGRAPH === content.contentType) {
        return (content as unknown as ArticleParagraph).articleParagraphNumber;
    } else if (Content.SUB_ARTICLE === content.contentType) {
        return (content as unknown as Subarticle).subarticleNumber;
    } else if (Content.PARAGRAPH_GROUP === content.contentType) {
        return (content as unknown as ParagraphGroup).paragraphGroupNumber;
    } else if (Content.PARAGRAPH === content.contentType) {
        return (content as unknown as Paragraph).paragraphNumber;
    } else {
        return null;
    }
}

/**
 * @returns the first and last `paragraphNumber` values of all the `Paragraph`s contained by the provided content
 */
function getTerminalParagraphNumbers(
    content: ContentBase,
): { firstParagraphNumber: number; lastParagraphNumber: number } {
    const paragraphs = getParagraphs([content]);
    const firstParagraphNumber = paragraphs.at(0)?.paragraphNumber ?? null;
    const lastParagraphNumber = paragraphs.at(-1)?.paragraphNumber ?? null;

    if (firstParagraphNumber === null || lastParagraphNumber === null) {
        throw new Error(
            `A terminal paragraph could not be found for the given content: ${content.contentType}, pathID: ${content.pathID}. ` +
                `Terminal paragraph numbers: ${firstParagraphNumber}, ${lastParagraphNumber}`,
        );
    }

    return { firstParagraphNumber, lastParagraphNumber };
}
//#endregion
