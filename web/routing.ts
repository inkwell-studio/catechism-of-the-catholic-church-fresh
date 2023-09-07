import PathMapEnglish from '../catechism/artifacts/semantic-path_to_renderable-path-id-en.json' assert { type: 'json' };
import PathMapLatin from '../catechism/artifacts/semantic-path_to_renderable-path-id-la.json' assert { type: 'json' };
import PathMapSpanish from '../catechism/artifacts/semantic-path_to_renderable-path-id-es.json' assert { type: 'json' };

import { translate } from './translation.ts';
import { Language, PathID, SemanticPath, SemanticPathPathIdMap } from '../catechism/source/types/types.ts';

const pathMaps = {
    [Language.ENGLISH]: PathMapEnglish,
    [Language.LATIN]: PathMapLatin,
    [Language.SPANISH]: PathMapSpanish,
} as const;

export function getElementAndPathID(
    language: Language,
    contentPath: string,
): { element: Element; pathID: PathID | null } | null {
    if (!contentPath || 'table-of-contents' === contentPath) {
        return {
            element: Element.TABLE_OF_CONTENTS,
            pathID: null,
        };
    } else {
        const pathID = getRenderablePathID(language, contentPath);
        if (pathID) {
            return {
                element: Element.CONTENT,
                pathID,
            };
        } else {
            return null;
        }
    }
}

/**
 * @returns the URL for viewing the content at the given path
 */
export function getUrl(language: Language, semanticPath: SemanticPath): string {
    const fragment = getUrlFragment(semanticPath, true, language);
    // deno-fmt-ignore
    return fragment
        ? `/${language}/` + semanticPath.replace(`/${fragment}`, `#${fragment}`)
        : `/${language}/${semanticPath}`;
}

/**
 * @returns the URL fragment (i.e. that which comes after '#') for the content at the given path, or `undefined` if no fragment is necessary
 */
export function getUrlFragment(
    semanticPath: SemanticPath,
    acknowledgeFinalContent: boolean,
    language: Language,
): string | undefined {
    const highLevelFragment = getHighLevelUrlFragment(semanticPath, language);
    if (highLevelFragment) {
        return highLevelFragment;
    } else {
        return getLowLevelUrlFragment(semanticPath, acknowledgeFinalContent, language);
    }
}

function getHighLevelUrlFragment(semanticPath: SemanticPath, language: Language): string | undefined {
    /*
        These regular expressions are intended to find the first instance of `highLevelContent-1` within the given path that is not followed
        by a `highLevelContent-n` instance, where `n` > 1 and `highLevelContent` is one of 'section', 'chapter', 'article', or 'article-paragraph'.
        The only differences between them are the language-specific words.
    */
    let regex =
        /\/(section|chapter|article|article-paragraph)-1(?=\/|$)(?!.*(\/chapter|\/article|\/article-paragraph)-(\d{2,}|[2-9]))/;
    /*      ^                                          ^         ^
            |                                          |         |
            |                                          |         there cannot be any following high-level content items that are not the first child of their parent (i.e. their number is greater than 1)
            |                                          |
            |                                          the content type must be followed by `-1` and the end of the string, or `-1/`
            |
            the first high-level content type that is the first child of its parent
    */

    if (Language.LATIN === language) {
        regex =
            /\/(sectio|caput|articulus|articulus-paragraphus)-1(?=\/|$)(?!.*(\/caput|\/articulus|\/articulus-paragraphus)-(\d{2,}|[2-9]))/;
    } else if (Language.SPANISH === language) {
        regex =
            /\/(seccion|capitulo|articulo|articulo-parrafo)-1(?=\/|$)(?!.*(\/capitulo|\/articulo|\/articulo-parrafo)-(\d{2,}|[2-9]))/;
    }

    const match = semanticPath.match(regex);
    return match && match.index ? semanticPath.slice(match.index + 1) : undefined;
}

function getLowLevelUrlFragment(
    semanticPath: SemanticPath,
    acknowledgeFinalContent: boolean,
    language: Language,
): string | undefined {
    const fragmentStarts = [
        'in-brief',
        'subarticle-',
        // This is for both `ParagraphGroup`s and `Paragraph`s
        'paragraph-',
    ].map((start) => translate(start, language))
        .map((start) => '/' + start);

    if (acknowledgeFinalContent) {
        fragmentStarts.push('/' + translate('final-content', language));
    }

    const fragmentIndices = fragmentStarts
        .map((fs) => semanticPath.indexOf(fs))
        .filter((i) => i > 0);

    const firstFragmentIndex = fragmentIndices.length > 0 ? Math.min(...fragmentIndices) : null;

    return firstFragmentIndex ? semanticPath.slice(firstFragmentIndex + 1) : undefined;
}

export enum Element {
    TABLE_OF_CONTENTS = 'TABLE_OF_CONTENTS',
    CONTENT = 'CONTENT',
    GLOSSARY = 'GLOSSARY',
    INDEX = 'INDEX',
}

/**
 * @returns the renderable `PathID` corresponding to the given value, or `null` if no such `PathID` exists
 */
function getRenderablePathID(language: Language, value: SemanticPath): PathID | null {
    return getPathMap(language)[value] ?? null;
}

function getPathMap(language: Language): SemanticPathPathIdMap {
    return pathMaps[language];
}
