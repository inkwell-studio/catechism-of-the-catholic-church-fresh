import RenderablePathMap from '../catechism/artifacts/semantic-path_to_renderable-path-id.json' assert { type: 'json' };
import { PathID, SemanticPath, SemanticPathPathIdMap } from '../catechism/source/types/types.ts';

/**
 * @returns the URL for viewing the content at the given path
 */
export function getUrl(semanticPath: SemanticPath): string {
    const fragment = getUrlFragment(semanticPath, true);
    // deno-fmt-ignore
    return fragment
        ? '/read/' + semanticPath.replace(`/${fragment}`, `#${fragment}`)
        : `/read/${semanticPath}`;
}

/**
 * @returns the URL fragment (i.e. that which comes after '#') for the content at the given path, or `undefined` if no fragment is necessary
 */
export function getUrlFragment(semanticPath: SemanticPath, acknowledgeFinalContent: boolean): string | undefined {
    const highLevelFragment = getHighLevelUrlFragment(semanticPath);
    if (highLevelFragment) {
        return highLevelFragment;
    } else {
        return getLowLevelUrlFragment(semanticPath, acknowledgeFinalContent);
    }
}

function getHighLevelUrlFragment(semanticPath: SemanticPath): string | undefined {
    // This regular expression is intended to find the first instance of `highLevelContent-1` within the given path that is not followed
    // by a `highLevelContent-n` instance, where `n` > 1 and `highLevelContent` is one of 'section', 'chapter', 'article', or 'article-paragraph'
    const regex =
        /\/(section|chapter|article|article-paragraph)-1(?=\/|$)(?!.*(\/chapter|\/article|\/article-paragraph)-(\d{2,}|[2-9]))/;
    /*      ^                                          ^         ^
            |                                          |         |
            |                                          |         there cannot be any following high-level content items that are not the first child of their parent (i.e. their number is greater than 1)
            |                                          |
            |                                          the content type must be followed by `-1` and the end of the string, or `-1/`
            |
            the first high-level content type that is the first child of its parent
    */
    const match = semanticPath.match(regex);
    return match && match.index ? semanticPath.slice(match.index + 1) : undefined;
}

export function getLowLevelUrlFragment(
    semanticPath: SemanticPath,
    acknowledgeFinalContent: boolean,
): string | undefined {
    const fragmentStarts = [
        '/in-brief',
        '/subarticle-',
        // This is for both `ParagraphGroup`s and `Paragraph`s
        '/paragraph-',
    ];

    if (acknowledgeFinalContent) {
        fragmentStarts.push('/final-content');
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

export function getElementAndPathID(contentPath: string): { element: Element; pathID: PathID | null } | null {
    if (!contentPath || 'table-of-contents' === contentPath) {
        return {
            element: Element.TABLE_OF_CONTENTS,
            pathID: null,
        };
    } else {
        const pathID = getRenderablePathID(contentPath);
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
 * @returns the renderable `PathID` corresponding to the given value, or `null` if no such `PathID` exists
 */
function getRenderablePathID(value: SemanticPath): PathID | null {
    return (RenderablePathMap as SemanticPathPathIdMap)[value] ?? null;
}
