import {
    CatechismStructure,
    Content,
    ContentBase,
    ContentContainer,
    Paragraph,
    Part,
    PathID,
    Prologue,
} from './source/types/types.ts';

// TODO: Use this instead of `hasMainContent` where appropriate
export function hasChildContent<T extends ContentBase>(content: T): boolean {
    return hasMainContent(content);
}

export function hasFinalContent<T extends ContentBase>(content: T): boolean {
    return 'finalContent' in content && Array.isArray(content.finalContent);
}

export function hasMainContent<T extends ContentBase>(content: T): boolean {
    return 'mainContent' in content && Array.isArray(content.mainContent);
}

export function hasOpeningContent<T extends ContentBase>(content: T): boolean {
    return 'openingContent' in content && Array.isArray(content.openingContent);
}

export function hasInBrief<T extends ContentBase>(content: T): boolean {
    return 'inBrief' in content && !!content.inBrief;
}

export function getOpeningAndMainContent<T extends ContentBase & ContentContainer>(c: T): Array<T> {
    // deno-lint-ignore no-explicit-any
    const openingContent = hasOpeningContent(c) ? (c as any).openingContent : [];

    return [...openingContent, ...c.mainContent];
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
export function getParagraphs<T extends ContentBase & ContentContainer>(allContent: Array<T>): Array<Paragraph> {
    return helper([], allContent);

    function helper<T extends ContentBase & ContentContainer>(
        paragraphs: Array<Paragraph>,
        content: Array<T>,
    ): Array<Paragraph> {
        content.forEach((c) => {
            if (Content.PARAGRAPH === c.contentType) {
                paragraphs.push(c as unknown as Paragraph);
            } else if (hasMainContent(c)) {
                const childContent = getOpeningAndMainContent(c);
                return helper(paragraphs, childContent);
            }
        });

        return paragraphs;
    }
}

export function getAllPathIDs(catechism: CatechismStructure): Array<PathID> {
    const allContent = getAllContent(catechism);
    return allContent.flatMap((content) => helper(content));

    function helper<T extends ContentBase & ContentContainer>(content: T): Array<PathID> {
        if (hasMainContent(content)) {
            const children = getOpeningAndMainContent(content);
            return [
                content.pathID,
                ...children.flatMap((child) => helper(child)),
            ];
        } else {
            return [content.pathID];
        }
    }
}
