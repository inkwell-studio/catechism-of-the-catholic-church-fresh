import { Content } from './content.ts';

export type SemanticPath =
    | `${string}`
    | `${string}/${string}`
    | `${string}/${string}/${string}`
    | `${string}/${string}/${string}/${string}`
    | `${string}/${string}/${string}/${string}/${string}`
    | `${string}/${string}/${string}/${string}/${string}/${string}`
    | `${string}/${string}/${string}/${string}/${string}/${string}/${string}`;

export type SemanticPathSource = { content: Content; number: number | null };

/**
 * @param ancestors a list of ancestors of `child`, in descending order (i.e. `ancestors[i]` is the parent of `ancestors[i+1]`)
 */
export function buildSemanticPath(child: SemanticPathSource, ancestors: Array<SemanticPathSource>): SemanticPath {
    return [...ancestors, child]
        .map((segment) => getSegmentString(segment))
        .join('/');
}

function getSegmentString(segment: SemanticPathSource): string {
    return segment.number !== null ? contentMap[segment.content] + `-${segment.number}` : contentMap[segment.content];
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
