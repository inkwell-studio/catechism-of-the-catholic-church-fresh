/**
 * This is used to identify each node in the `CatechismStructure` tree,
 * and to provide the traversal path from the root of a `CatechismStructure` object to the node.
 *
 * Each `PathID` value is a sequence of indices from the root of a `CatechismStructure` object to the indentified node.
 * The indices are separated by hyphens.
 * The top-level indexes refer to the following:
 *
 *      0 = CatechismStructure.prologue
 *      i where i > 0 = CatechismStructure.parts[i - 1]
 *
 * Each index thereafter refers to the index of the array of the parent's children as returned by `util.ts:getOpeningAndMainContent()`.
 * This allows for the `PathID` of a parent to be determined from its childrens' `PathID` values: the last index is removed from the child's `PathID`.
 */
export type PathID =
    | `${number}`
    | `${number}${Separator}${number}`
    | `${number}${Separator}${number}${Separator}${number}`
    | `${number}${Separator}${number}${Separator}${number}${Separator}${number}`
    | `${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}`
    | `${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}`
    | `${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}`
    | `${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}`
    | `${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}`
    | `${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}`
    | `${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}${Separator}${number}`;

type Separator = '-';

export function getTopIndex(pathID: PathID): number {
    function fail(invalidInput: PathID): number {
        console.error(`invalid pathID encountered: ${invalidInput}`);
        return 0;
    }

    try {
        if (pathID.includes('.')) {
            return fail(pathID);
        } else {
            const firstSeparatorIndex = getFirstSeparatorIndex(pathID);
            if (firstSeparatorIndex > 0) {
                const topIndex = pathID.slice(0, firstSeparatorIndex);
                return Number(topIndex);
            } else if (firstSeparatorIndex < 0) {
                return Number(pathID);
            } else {
                return fail(pathID);
            }
        }
    } catch {
        return fail(pathID);
    }
}

export function getPartialChildPathID(pathID: PathID): PathID | null {
    const firstSeparatorIndex = getFirstSeparatorIndex(pathID);
    if (firstSeparatorIndex > 0) {
        return pathID.slice(firstSeparatorIndex + 1) as PathID;
    } else {
        return null;
    }
}

function getFirstSeparatorIndex(pathID: PathID): number {
    return pathID.indexOf('-');
}
