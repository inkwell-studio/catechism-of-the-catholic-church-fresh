import {
    CatechismStructure,
    Content,
    ContentBase,
    ContentContainer,
    InBrief,
    InBriefContainer,
    Language,
    Paragraph,
    PathID,
    SemanticPath,
} from '../types/types.ts';

export async function getCatechism(language: Language): Promise<CatechismStructure> {
    const file = `catechism-${language}.json`;
    const catechism = await import(`../../content/${file}`, { assert: { type: 'json' } });
    return catechism.default;
}

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
    ];

    const inBrief = getInBrief(c);
    if (inBrief) {
        childContent.push(inBrief);
    }

    childContent.push(...getFinalContent(c));

    return childContent;
}

export function getAllContent(catechism: CatechismStructure): Array<ContentContainer> {
    return [catechism.prologue, ...catechism.parts];
}

/**
 * @returns the `Paragraph`s of the Catechism in their listed order
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
                    helper(paragraphs, childContent);
                }
            }
        });

        return paragraphs;
    }
}

export function getAllPathIDs(catechism: CatechismStructure): Array<PathID> {
    const content = getAllContent(catechism);
    return getAllOfProperty<PathID>('pathID', content);
}

export function getAllSemanticPaths(catechism: CatechismStructure): Array<SemanticPath> {
    const content = getAllContent(catechism);
    return getAllOfProperty<SemanticPath>('semanticPath', content);
}

export function getAllOfProperty<T>(propertyName: keyof ContentBase, allContent: Array<ContentBase>): Array<T> {
    return allContent.flatMap((content) => helper(content));

    function helper(content: ContentBase): Array<T> {
        if (hasMainContent(content)) {
            const children = getAllChildContent(content);
            return [
                content[propertyName] as T,
                ...children.flatMap((child) => helper(child)),
            ];
        } else {
            return [content[propertyName] as T];
        }
    }
}
