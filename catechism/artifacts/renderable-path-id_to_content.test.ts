import Catechism from '../content/catechism.json' assert { type: 'json' };
import ContentMap from './renderable-path-id_to_content.json' assert { type: 'json' };
import RenderablePathMap from './semantic-path_to_renderable-path-id.json' assert { type: 'json' };

import { assertStrictEquals, fail } from '$deno/testing/asserts.ts';

import { getAllOfProperty, getAllPathIDs } from '../source/utils/content.ts';
import { CatechismStructure, ContentContainer, PathID } from '../source/types/types.ts';

console.log('\nPathID to content map ...');

Deno.test('all PathID entries are unique', () => {
    const pathIDs = Object.keys(ContentMap);
    const numUniquePathIDs = new Set(pathIDs).size;

    const numPathIDs = pathIDs.length;
    assertStrictEquals(numPathIDs, numUniquePathIDs, `${numPathIDs - numUniquePathIDs} duplicate entry PathIDs exist`);
});

Deno.test('the number of entries is equal to the number of semantic-path-to-renderable-path entries', () => {
    assertStrictEquals(
        Object.keys(ContentMap).length,
        Object.keys(RenderablePathMap).length,
    );
});

Deno.test('all content is included', () => {
    const contentMapContent = Object.values(ContentMap) as Array<ContentContainer>;
    const mapPathIDs = getAllOfProperty<PathID>('pathID', contentMapContent);

    const catechismPathIDs = getAllPathIDs(Catechism as CatechismStructure);
    const missingPathIDs = catechismPathIDs.filter((catPathID) => !mapPathIDs.includes(catPathID));

    if (missingPathIDs.length > 0) {
        const missingIDsText = '\n\t' + missingPathIDs.join('\n\t');
        fail(`of ${catechismPathIDs.length} PathIDs, ${missingPathIDs.length} are missing: ${missingIDsText}`);
    }
});
