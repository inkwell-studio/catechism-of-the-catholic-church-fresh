import {
    CatechismStructure,
    Content,
    ContentBase,
    ContentContainer,
    InBrief,
    InBriefContainer,
    Paragraph,
    Part,
    PathID,
    Prologue,
} from './source/types/types.ts';

export function hasFinalContent(content: ContentBase): boolean {
    return 'finalContent' in content && Array.isArray(content.finalContent);
}

export function hasMainContent(content: ContentBase): boolean {
    return 'mainContent' in content && Array.isArray(content.mainContent);
}

export function hasOpeningContent(content: ContentBase): boolean {
    return 'openingContent' in content && Array.isArray(content.openingContent);
}

export function hasInBrief(content: ContentBase): boolean {
    return 'inBrief' in content && !!content.inBrief;
}

/**
 * @returns the opening content of the argument if it has any; otherwise an empty array
 */
export function getOpeningContent(c: ContentBase | ContentContainer): Array<ContentBase> {
    return hasOpeningContent(c) ? (c as ContentContainer).openingContent : [];
}

/**
 * @returns the main content of the argument if it has any; otherwise an empty array
 */
export function getMainContent(c: ContentBase | ContentContainer): Array<ContentBase> {
    return hasMainContent(c) ? (c as ContentContainer).mainContent : [];
}

/**
 * @returns the final content of the argument if it has any; otherwise an empty array
 */
export function getFinalContent(c: ContentBase | ContentContainer): Array<ContentBase> {
    return hasFinalContent(c) ? (c as ContentContainer).finalContent : [];
}

/**
 * @returns the In Brief content of the argument if it has any; otherwise null
 */
export function getInBrief(c: ContentBase | InBriefContainer): InBrief | null {
    return hasInBrief(c) ? (c as InBriefContainer).inBrief : null;
}

export function getAllChildContent(c: ContentBase): Array<ContentBase> {
    const childContent = [
        ...getOpeningContent(c),
        ...getMainContent(c),
        ...getFinalContent(c),
    ];

    const inBrief = getInBrief(c);
    if (inBrief) {
        childContent.push(inBrief);
    }

    return childContent;
}

export function getAllContent(catechism: CatechismStructure): Array<Prologue | Part> {
    return [catechism.prologue, ...catechism.parts];
}

/**
 * @returns the `Paragraph`s of the Catechism in the order that they are listed
 */
export function getAllParagraphs(catechism: CatechismStructure): Array<Paragraph> {
    const allContent = getAllContent(catechism);
    return getParagraphs(allContent);
}

/**
 * @returns the `Paragraph`s of the given content in the order that they are listed
 */
export function getParagraphs(allContent: Array<ContentBase>): Array<Paragraph> {
    return helper([], allContent);

    function helper(
        paragraphs: Array<Paragraph>,
        content: Array<ContentBase>,
    ): Array<Paragraph> {
        content.forEach((c) => {
            if (Content.PARAGRAPH === c.contentType) {
                paragraphs.push(c as unknown as Paragraph);
            } else {
                const childContent = getAllChildContent(c);
                if (childContent.length > 0) {
                    return helper(paragraphs, childContent);
                }
            }
        });

        return paragraphs;
    }
}

export function getAllPathIDs(catechism: CatechismStructure): Array<PathID> {
    const allContent = getAllContent(catechism);
    return allContent.flatMap((content) => helper(content));

    function helper(content: ContentBase): Array<PathID> {
        if (hasMainContent(content)) {
            const children = getAllChildContent(content);
            return [
                content.pathID,
                ...children.flatMap((child) => helper(child)),
            ];
        } else {
            return [content.pathID];
        }
    }
}
