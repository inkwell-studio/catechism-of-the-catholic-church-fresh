import { assert, assertNotMatch, assertStrictEquals } from '$deno/testing/asserts.ts';

import { CatechismStructure, Container, ContentBase, PathID, SemanticPath } from '../source/types/types.ts';
import {
    getAllChildContent,
    getAllContent,
    getAllParagraphs,
    getAllPathIDs,
    getAllSemanticPaths,
    getCatechism,
    getFinalContent,
    getInBrief,
    getMainContent,
    getOpeningContent,
} from '../source/utils/content.ts';
import { getSupportedLanguages } from '../source/utils/language.ts';
import { getContainerDesignator, isValid } from '../source/utils/path-id.ts';

//#region tests
console.log('\nCatechism data ...');
for await (const [key, language] of getSupportedLanguages()) {
    const catechism = await getCatechism(language);
    runTests(key, catechism);
}

function runTests(
    languageKey: string,
    catechism: CatechismStructure,
): void {
    const paragraphs = getAllParagraphs(catechism);

    Deno.test(`[${languageKey}] the language is set`, () => {
        const languages = getSupportedLanguages().map(([_key, language]) => language);
        assert(
            languages.includes(catechism.language),
            `the Catechism language is not set to a valid value: ${catechism.language}`,
        );
    });

    Deno.test(`[${languageKey}] all PathIDs are valid`, () => {
        const pathIDs = getAllPathIDs(catechism);
        pathIDs.forEach((pathID) => assert(isValid(pathID), `invalid PathID: ${pathID}`));
    });

    Deno.test(`[${languageKey}] all PathIDs are unique`, () => {
        const pathIDs = getAllPathIDs(catechism);
        const numUniquePathIDs = new Set(pathIDs).size;

        const numPathIDs = pathIDs.length;
        assertStrictEquals(
            numPathIDs,
            numUniquePathIDs,
            `${numPathIDs - numUniquePathIDs} duplicate pathID values exist`,
        );
    });

    Deno.test(`[${languageKey}] all PathIDs are correctly set relative to their parent`, () => {
        const allContent = getAllContent(catechism);
        allContent.forEach((content) => {
            const openingContent = getOpeningContent(content);
            const mainContent = getMainContent(content);
            const finalContent = getFinalContent(content);

            openingContent.forEach((child, index) => helper(child, Container.OPENING, index, content.pathID));
            mainContent.forEach((child, index) => helper(child, Container.MAIN, index, content.pathID));
            finalContent.forEach((child, index) => helper(child, Container.FINAL, index, content.pathID));

            const inBrief = getInBrief(content);
            if (inBrief) {
                const expectedPathID = `${content.pathID}__i`;
                test(inBrief, expectedPathID);
            }
        });

        function helper(content: ContentBase, container: Container, index: number, parentPathID: PathID): void {
            const containerDesignator = getContainerDesignator(container);

            const expectedPathID = Container.IN_BRIEF === container
                ? `${parentPathID}__i`
                : `${parentPathID}__${containerDesignator}.${index}`;

            test(content, expectedPathID);

            const openingContent = getOpeningContent(content);
            const mainContent = getMainContent(content);
            const finalContent = getFinalContent(content);

            openingContent.forEach((child, index) => helper(child, Container.OPENING, index, content.pathID));
            mainContent.forEach((child, index) => helper(child, Container.MAIN, index, content.pathID));
            finalContent.forEach((child, index) => helper(child, Container.FINAL, index, content.pathID));
        }

        function test(content: ContentBase, expectedPathID: PathID): void {
            assertStrictEquals(
                content.pathID,
                expectedPathID,
                `Content expected to have pathID of ${expectedPathID}, but has ${content.pathID} instead`,
            );
        }
    });

    Deno.test(`[${languageKey}] all semanticPaths are unique`, () => {
        const semanticPaths = getAllSemanticPaths(catechism);
        const numUniquePaths = new Set(semanticPaths).size;

        const numPaths = semanticPaths.length;
        assertStrictEquals(
            numPaths,
            numUniquePaths,
            `${numPaths - numUniquePaths} duplicate semanticPath values exist`,
        );
    });

    Deno.test(`[${languageKey}] all semanticPaths are correctly set relative to their parent`, () => {
        const allContent = getAllContent(catechism);
        allContent.forEach((content) => {
            const childContent = getAllChildContent(content);
            childContent.forEach((child) => helper(child, content.semanticPath));
        });

        function helper(content: ContentBase, parentSemanticPath: SemanticPath): void {
            // The child's semantic path without its last content entry should be equal to its parent's semantic path
            const i = content.semanticPath.lastIndexOf('/');
            const derivedParentSemanticPath = content.semanticPath.slice(0, i);

            assertStrictEquals(
                derivedParentSemanticPath,
                parentSemanticPath,
            );

            const childContent = getAllChildContent(content);
            childContent.forEach((child) => helper(child, content.semanticPath));
        }
    });

    Deno.test(`[${languageKey}] no semanticPaths should have the number 0 as an identifying number`, () => {
        const semanticPaths = getAllSemanticPaths(catechism);

        // Verify the last entry in the semantic path isn't numbered 0
        const endingZero = /-0$/;

        // Verify the first and intermediate entries in the semantic path aren't numbered 0
        const nonEndingZero = /-0\//;

        const failureMessage = 'semantic paths should not have an identifying number of 0:\n\n\t';

        semanticPaths.forEach((path) => {
            assertNotMatch(path, endingZero, failureMessage + path + '\n');
            assertNotMatch(path, nonEndingZero, failureMessage + path + '\n');
        });
    });

    // * ensure that there are no missing paragraphs between #1 and the greatest number
    Deno.test(`[${languageKey}] the paragraph range is continuous`, () => {
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

    Deno.test(`[${languageKey}] all paragraphs have content`, () => {
        paragraphs.forEach((paragraph) =>
            assert(paragraph.mainContent.length > 0, `paragraph ${paragraph.paragraphNumber} has no content`)
        );
    });
}
//#endregion
