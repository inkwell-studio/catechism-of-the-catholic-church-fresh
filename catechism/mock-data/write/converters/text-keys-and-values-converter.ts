// deno-lint-ignore-file no-explicit-any
import { TextKeyAndValue } from './text-key-and-value.ts';
import { CatechismStructure } from '../../../source/types/catechism-structure.ts';
import { Content } from '../../../source/types/content.ts';
import { ContentBase } from '../../../source/types/types.ts';
import { hasFinalContent, hasInBrief, hasMainContent, hasOpeningContent } from '../../../utils.ts';

type ContentOccurrences = Map<Content, number>;
enum ContentCategory {
    OPENING = 'OPENING',
    MAIN = 'MAIN',
    FINAL = 'FINAL',
}

export function determineTextKeysAndValuesAndUpdateCatechismObject(
    catechism: CatechismStructure,
): { catechism: CatechismStructure; texts: Array<TextKeyAndValue> } {
    catechism = structuredClone(catechism);

    const prologueResults = helper([catechism.prologue], null, [], []);
    const partsResults = helper(catechism.parts, null, [], []);

    (catechism as any).prologue = prologueResults.content[0];
    (catechism as any).parts = partsResults.content;

    const texts = [...prologueResults.texts, ...partsResults.texts];

    return {
        catechism,
        texts,
    };

    function helper<T extends ContentBase>(
        content: Array<T>,
        contentCategory: ContentCategory | null,
        path: Array<string>,
        texts: Array<TextKeyAndValue>,
    ): { content: Array<T>; texts: Array<TextKeyAndValue> } {
        const contentOccurrences: ContentOccurrences = new Map();

        content.forEach((c) => {
            const newOccurrenceCount = (contentOccurrences.get(c.contentType) ?? 0) + 1;
            contentOccurrences.set(c.contentType, newOccurrenceCount);

            const pathSegment = (contentCategory ? `${contentCategory}__` : '') +
                c.contentType +
                '_' +
                getPaddedNumber(newOccurrenceCount, 2);

            const newPath = [...path, pathSegment];

            const property = getPropertyRequiringTextReplacement(c);
            if (property) {
                const textKeyAndValue = determineTextKeyAndValue(c, newPath);
                texts.push(textKeyAndValue);

                // overwrite the property value with the TextKey source code
                (c as any)[property] = 'TextKey.' + textKeyAndValue.key;
            }

            const openingContentExists = hasOpeningContent(c);
            if (openingContentExists) {
                const openingContent = (c as any).openingContent;
                const results = helper(openingContent, ContentCategory.OPENING, newPath, texts);
                texts = results.texts;
                (c as any)['openingContent'] = results.content;
            }

            const mainContentExists = hasMainContent(c);
            if (mainContentExists) {
                const mainContent = (c as any).mainContent;
                const results = helper(mainContent, ContentCategory.MAIN, newPath, texts);
                texts = results.texts;
                (c as any)['mainContent'] = results.content;
            }

            const finalContentExists = hasFinalContent(c);
            if (finalContentExists) {
                const finalContent = (c as any).finalContent;
                const results = helper(finalContent, ContentCategory.FINAL, newPath, texts);
                texts = results.texts;
                (c as any)['finalContent'] = results.content;
            }

            const inBriefExists = hasInBrief(c);
            if (inBriefExists) {
                const inBrief = (c as any).inBrief;
                const results = helper([inBrief], null, newPath, texts);
                texts = results.texts;
                (c as any)['inBrief'] = results.content[0];
            }
        });

        return {
            content,
            texts,
        };
    }
}

/**
 * @returns the TextKey corresponding to the given content paired with the content
 *
 * The TextKey is set as follows:
 *
 * `[path]__[content category]__[content type]_[n1]__[property]`
 * where `n1` and is the ordinal number for the given content at the given path. Note that [property] is omitted for BlockQuote and Text types.
 *
 * For example, for the title of `Part 2 (opening) > Section 1 (main) > Chapter 3 (main) > Article 4`, the TextKey would be:
 * `PART_02__OPENING__SECTION_01__MAIN__CHAPTER_03__MAIN__ARTICLE_04__TITLE`
 *
 * `n1` is padded with leading zeroes as necessary to ensure its length as a string is two characters; e.g. `7` becomes `07`.
 */
function determineTextKeyAndValue<T extends ContentBase>(
    content: T,
    path: Array<string>,
): TextKeyAndValue {
    const propertyName = getPropertyRequiringTextReplacement(content) ?? 'MISSING_PROPERTY';
    if (!propertyName) {
        console.log(`WARNING: A property name could not be determined for ${content.contentType} at ${path.join('-')}`);
    }

    const key = Content.TEXT_WRAPPER === content.contentType
        ? path.join('__')
        : path.join('__') + `__${propertyName.toUpperCase()}`;

    return {
        key,
        value: (content as any)[propertyName],
    };
}

/**
 * @returns the name of the property on `content` requiring replacement with a `TextKey` reference, or `null` if no such property exists on the content
 */
function getPropertyRequiringTextReplacement<T extends ContentBase>(content: T): string | null {
    switch (content.contentType) {
        case Content.PROLOGUE: {
            return 'title';
        }
        case Content.PART: {
            return 'title';
        }
        case Content.SECTION: {
            return 'title';
        }
        case Content.CHAPTER: {
            return 'title';
        }
        case Content.ARTICLE: {
            return 'title';
        }
        case Content.ARTICLE_PARAGRAPH: {
            return 'title';
        }
        case Content.SUB_ARTICLE: {
            return 'title';
        }
        case Content.PARAGRAPH_GROUP: {
            return 'title';
        }
        case Content.TEXT: {
            return 'content';
        }
        case Content.TEXT_HEADING: {
            return 'content';
        }
        default: {
            return null;
        }
    }
}

function getPaddedNumber(n: number, desiredLength: number): string {
    const s = `000${n}`;
    return s.slice(s.length - desiredLength);
}
