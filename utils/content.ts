import { Catechism } from '../catechism/source/catechism.ts';
import {
    ContentBase,
    ContentContainer,
    getPartialChildPathID,
    getTopIndex,
    PathID,
} from '../catechism/source/types/types.ts';
import { getOpeningAndMainContent } from '../catechism/utils.ts';

export function getContent(pathID: PathID): ContentBase {
    const content = [
        Catechism.prologue,
        ...Catechism.parts,
    ];

    return helper(content, pathID);
}

function helper(contents: Array<ContentBase>, pathID: PathID): ContentBase {
    const partialChildPathID = getPartialChildPathID(pathID);
    const hasChildren = partialChildPathID !== null;

    if (hasChildren) {
        const topIndex = getTopIndex(pathID);
        const content = contents[topIndex];
        const childContent = getOpeningAndMainContent(content as ContentBase & ContentContainer);
        return helper(childContent, partialChildPathID);
    } else {
        const topIndex = getTopIndex(pathID);
        return contents[topIndex];
    }
}
