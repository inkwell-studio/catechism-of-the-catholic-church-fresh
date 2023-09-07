import { assertStrictEquals, fail } from '$deno/testing/asserts.ts';

import { getAllOfProperty, getAllPathIDs, getCatechism } from '../source/utils/content.ts';
import { CatechismStructure, PathID, PathIdContentMap, SemanticPathPathIdMap } from '../source/types/types.ts';
import { getContentMap, getRenderablePathMap } from '../source/utils/artifacts.ts';
import { getAllLanguages } from '../source/utils/language.ts';

console.log('\nPathID to content map ...');
for await (const [key, language] of getAllLanguages()) {
    const catechism = await getCatechism(language);
    const contentMap = await getContentMap(language);
    const renderablePathMap = await getRenderablePathMap(language);

    runTests(key, catechism, contentMap, renderablePathMap);
}

function runTests(
    languageKey: string,
    catechism: CatechismStructure,
    contentMap: PathIdContentMap,
    renderablePathMap: SemanticPathPathIdMap,
): void {
    Deno.test(`[${languageKey}] all PathID entries are unique`, () => {
        const pathIDs = Object.keys(contentMap);
        const numUniquePathIDs = new Set(pathIDs).size;

        const numPathIDs = pathIDs.length;
        assertStrictEquals(
            numPathIDs,
            numUniquePathIDs,
            `${numPathIDs - numUniquePathIDs} duplicate entry PathIDs exist`,
        );
    });

    Deno.test(`[${languageKey}] the number of entries is equal to the number of semantic-path-to-renderable-path entries`, () => {
        assertStrictEquals(
            Object.keys(contentMap).length,
            Object.keys(renderablePathMap).length,
        );
    });

    Deno.test(`[${languageKey}] all content is included`, () => {
        const contentMapContent = Object.values(contentMap);
        const mapPathIDs = getAllOfProperty<PathID>('pathID', contentMapContent);

        const catechismPathIDs = getAllPathIDs(catechism);
        const missingPathIDs = catechismPathIDs.filter((catPathID) => !mapPathIDs.includes(catPathID));

        if (missingPathIDs.length > 0) {
            const missingIDsText = '\n\t' + missingPathIDs.join('\n\t');
            fail(`of ${catechismPathIDs.length} PathIDs, ${missingPathIDs.length} are missing: ${missingIDsText}`);
        }
    });
}
