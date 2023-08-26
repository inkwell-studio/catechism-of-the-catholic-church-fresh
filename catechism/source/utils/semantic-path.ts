import {
    Article,
    ArticleParagraph,
    Chapter,
    Content,
    ContentBase,
    Paragraph,
    ParagraphGroup,
    Part,
    Section,
    SemanticPath,
    SemanticPathSource,
    Subarticle,
} from '../types/types.ts';
import { getLeafPathIdNumber } from './path-id.ts';

/**
 * @param ancestors a list of ancestors of `child`, in descending order (i.e. `ancestors[i]` is the parent of `ancestors[i+1]`)
 */
export function buildSemanticPath(child: SemanticPathSource, ancestors: Array<SemanticPathSource>): SemanticPath {
    return [...ancestors, child]
        .map((segment) => getSegmentString(segment))
        .join('/');
}

export function getSemanticPathSource(content: ContentBase, isFinalContent: boolean): SemanticPathSource {
    return {
        content: content.contentType,
        number: getContentNumber(content),
        isFinalContent,
    };
}

function getContentNumber(content: ContentBase): number | null {
    if (Content.PROLOGUE === content.contentType) {
        return null;
    } else if (Content.PART === content.contentType) {
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
        const leafPathIdNumber = getLeafPathIdNumber(content.pathID);
        if ('i' === leafPathIdNumber) {
            return null;
        } else if (isNaN(leafPathIdNumber)) {
            throw new Error(
                `A SemanticPath.number value could not be determined for ${content.contentType} ${content.pathID}`,
            );
        } else {
            return leafPathIdNumber + 1;
        }
    }
}

function getSegmentString(segment: SemanticPathSource): string {
    if (segment.isFinalContent) {
        return 'final-content';
    } else {
        if (null !== segment.number) {
            return contentMap[segment.content] + `-${segment.number}`;
        } else {
            return contentMap[segment.content];
        }
    }
}

const contentMap: { [key in Content]: string } = {
    [Content.PROLOGUE]: 'prologue',
    [Content.PART]: 'part',
    [Content.SECTION]: 'section',
    [Content.CHAPTER]: 'chapter',
    [Content.CHAPTER_SECTION]: 'chapter-section',
    [Content.ARTICLE]: 'article',
    [Content.ARTICLE_PARAGRAPH]: 'article-paragraph',
    [Content.SUB_ARTICLE]: 'subarticle',
    [Content.IN_BRIEF]: 'in-brief',
    [Content.PARAGRAPH_GROUP]: 'paragraph-group',
    [Content.SPECIAL_1]: 'special-1',
    [Content.SPECIAL_2]: 'special-2',
    [Content.SPECIAL_3]: 'special-3',
    [Content.GENERIC_CONTENT_CONTAINER]: 'generic-content-container',
    [Content.BLOCK_QUOTE]: 'block-quote',
    [Content.PARAGRAPH]: 'paragraph',
    [Content.PARAGRAPH_SUB_ITEM_CONTAINER]: 'paragraph-sub-item-container',
    [Content.PARAGRAPH_SUB_ITEM]: 'paragraph-sub-item',
    [Content.TEXT_BLOCK]: 'text-block',
    [Content.TEXT_HEADING]: 'text-heading',
    [Content.TEXT_WRAPPER]: 'text-wrapper',
    [Content.TEXT]: 'text',
} as const;
