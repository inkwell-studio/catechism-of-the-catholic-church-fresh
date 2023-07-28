import { Catechism } from './catechism.ts';
import { ContentBase, PathID } from './types/types.ts';
import { getAllChildContent, getAllContent, getAllParagraphs, getAllPathIDs } from '../utils.ts';
import { assert, assertStrictEquals } from '../../dependencies.ts';

console.log('\nCatechism data ...');

const paragraphs = getAllParagraphs(Catechism);

Deno.test('all pathIDs are unique', () => {
    const pathIDs = getAllPathIDs(Catechism);
    const numUniquePathIDs = new Set(pathIDs).size;

    const numPathIDs = pathIDs.length;
    assertStrictEquals(numPathIDs, numUniquePathIDs, `${numPathIDs - numUniquePathIDs} duplicate pathIDs exist`);
});

Deno.test('all pathIDs are correctly set relative to their parent', () => {
    const allContent = getAllContent(Catechism);
    allContent.forEach((content) => {
        const childContent = getAllChildContent(content);
        childContent.forEach((child, index) => helper(child, index, content.pathID));
    });

    function helper(content: ContentBase, index: number, parentPathID: PathID): void {
        const expectedPathID = `${parentPathID}-${index}`;
        assertStrictEquals(
            content.pathID,
            expectedPathID,
            `Content expected to have pathID of ${expectedPathID}, but has ${content.pathID} instead`,
        );

        const childContent = getAllChildContent(content);
        childContent.forEach((child, childIndex) => helper(child, childIndex, content.pathID));
    }
});

// * ensure that there are no missing paragraphs between #1 and the greatest number
Deno.test('the paragraph range is continuous', () => {
    const paragraphNumbers = paragraphs.map((p) => p.paragraphNumber);

    assertStrictEquals(paragraphNumbers[0], 1, 'paragraph #1 is missing');

    paragraphNumbers.forEach((num, index) =>
        assertStrictEquals(
            num,
            index + 1,
            `paragraph ${index + 1} should follow paragraph ${index} (encountered ${num} instead)`,
        )
    );
});

Deno.test('all paragraphs have content', () => {
    paragraphs.forEach((paragraph) =>
        assert(paragraph.mainContent.length > 0, `paragraph ${paragraph.paragraphNumber} has no content`)
    );
});
