import semanticPathsToPathIds from '../catechism/artifacts/semantic-path-to-path-id.json' assert { type: 'json' };
import { PathID, PathMap, SemanticPath } from '../catechism/source/types/types.ts';

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
        const pathID = getPathID(contentPath);
        if (pathID) {
            return {
                element: Element.CONTENT,
                pathID: pathID,
            };
        }
    }

    return null;
}

/**
 * @returns the `PathID` corresponding to the given value, or `null` if no such `PathID` exists
 */
function getPathID(value: SemanticPath): PathID | null {
    const pathMap = semanticPathsToPathIds as PathMap;
    return pathMap[value] ?? null;
}
