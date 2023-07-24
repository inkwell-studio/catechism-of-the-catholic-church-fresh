import { PathMap, TableOfContentsEntry, TableOfContentsType } from '../source/types/types.ts';

export function build(tableOfContents: TableOfContentsType): PathMap {
    const pathMaps = [
        tableOfContents.prologue,
        ...tableOfContents.parts,
    ].flatMap((entry) => entryToPathMaps(entry));

    return pathMaps.reduce((previous, current) => (
        {
            ...previous,
            ...current,
        }
    ));
}

function entryToPathMaps(entry: TableOfContentsEntry): Array<PathMap> {
    return [
        getPathMap(entry),
        ...entry.children.flatMap((childEntry) => entryToPathMaps(childEntry)),
    ];
}

function getPathMap(entry: TableOfContentsEntry): PathMap {
    return {
        [entry.semanticPath]: entry.pathID,
    };
}
