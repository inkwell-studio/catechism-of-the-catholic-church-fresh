import { assert, assertExists, assertStrictEquals } from '$deno/testing/asserts.ts';

import { CatechismStructure, TableOfContentsEntry, TableOfContentsType } from '../source/types/types.ts';
import { getTableOfContents } from '../source/utils/artifacts.ts';
import { getAllParagraphs, getCatechism } from '../source/utils/content.ts';
import { getSupportedLanguages } from '../source/utils/language.ts';

//#region tests
console.log('\nTable of Contents ...');
for await (const [key, language] of getSupportedLanguages()) {
    const catechism = await getCatechism(language);
    const tableOfContents = await getTableOfContents(language);

    runTests(key, catechism, tableOfContents);
}

function runTests(
    languageKey: string,
    catechism: CatechismStructure,
    tableOfContents: TableOfContentsType,
): void {
    Deno.test(`[${languageKey}] all PathIDs are unique`, () => {
        const pathIDs = getAllEntries(tableOfContents).map((entry) => entry.pathID);
        const numUniquePathIDs = new Set(pathIDs).size;

        const numPathIDs = pathIDs.length;
        assertStrictEquals(numPathIDs, numUniquePathIDs, `${numPathIDs - numUniquePathIDs} duplicate PathIDs exist`);
    });

    Deno.test(`[${languageKey}] all semantic paths are unique`, () => {
        const semanticPaths = getAllEntries(tableOfContents).map((entry) => entry.semanticPath);
        const numUniqueSemanticPaths = new Set(semanticPaths).size;

        const numSemanticPaths = semanticPaths.length;
        assertStrictEquals(
            numSemanticPaths,
            numUniqueSemanticPaths,
            `${numSemanticPaths - numUniqueSemanticPaths} duplicate semantic paths exist`,
        );
    });

    Deno.test(`[${languageKey}] the first and last paragraphs should be covered by non-leaf nodes`, () => {
        const paragraphNumbers = getAllParagraphs(catechism).map((p) => p.paragraphNumber);

        const firstParagraphNumber = paragraphNumbers.at(0) ?? null;
        const lastParagraphNumber = paragraphNumbers.at(-1) ?? null;
        assertExists(firstParagraphNumber, 'no initial paragraph found');

        const tocEntries = getAllEntries(tableOfContents);
        const firstTocNumber = tocEntries.at(0)?.firstParagraphNumber;
        const lastTocNumber = tocEntries.at(-1)?.lastParagraphNumber;

        assertStrictEquals(
            firstTocNumber,
            firstParagraphNumber,
            `the Table of Contents does not cover the first paragraph (${firstParagraphNumber} expected, ${firstTocNumber} found)`,
        );
        assertStrictEquals(
            lastTocNumber,
            lastParagraphNumber,
            `the Table of Contents does not cover the last paragraph (coverage ends at ${lastTocNumber} instead of ${lastParagraphNumber})`,
        );
    });

    Deno.test(`[${languageKey}] paragraphs should be covered continuously by the top-level entries`, () => {
        testSiblingContinuity([tableOfContents.prologue, ...tableOfContents.parts]);
    });

    Deno.test(`[${languageKey}] the terminal paragraph numbers of an entry should not exceed those of its parent`, () => {
        [
            tableOfContents.prologue,
            ...tableOfContents.parts,
        ].forEach((parent) => {
            parent.children.forEach((child) => {
                helper(parent, child);
            });
        });

        function helper(
            parent: TableOfContentsEntry,
            child: TableOfContentsEntry,
        ): void {
            assert(
                child.firstParagraphNumber >= parent.firstParagraphNumber,
                `the first paragraph number of an entry should not be less than the first paragraph number of its parent ` +
                    `(entry with pathID ${child.pathID} has a first paragraph number of ${child.firstParagraphNumber}, beyond the lower bound of ${parent.firstParagraphNumber})`,
            );

            assert(
                child.lastParagraphNumber <= parent.lastParagraphNumber,
                `the last paragraph number of an entry should not exceed the last paragraph number of its parent ` +
                    `(entry with pathID ${child.pathID} has a last paragraph number of ${child.lastParagraphNumber}, beyond the upper bound of ${parent.lastParagraphNumber})`,
            );

            child.children.forEach((grandchild) => {
                helper(child, grandchild);
            });
        }
    });
}
//#endregion

//#region helpers
function testSiblingContinuity(siblings: Array<TableOfContentsEntry>): void {
    const firstChild = siblings[0];
    let latestParagraphNumber = firstChild.lastParagraphNumber;

    siblings.slice(1).forEach((sibling) => {
        assertStrictEquals(
            sibling.firstParagraphNumber,
            latestParagraphNumber + 1,
            `a gap in coverage exists between paragraphs ${latestParagraphNumber} and ${sibling.firstParagraphNumber} (pathID ${sibling.pathID})`,
        );
        latestParagraphNumber = sibling.lastParagraphNumber;
    });
}

/**
 * This pulls out all Table of Content entries into a single list, ordered by starting paragraph number
 */
function getAllEntries(tableOfContents: TableOfContentsType): Array<TableOfContentsEntry> {
    return [
        ...helper([], [tableOfContents.prologue]),
        ...tableOfContents.parts.flatMap((part) => helper([], [part])),
    ];

    function helper(
        entries: Array<TableOfContentsEntry>,
        children: Array<TableOfContentsEntry>,
    ): Array<TableOfContentsEntry> {
        children.forEach((child) => {
            if (child.children.length > 0) {
                return helper(entries, child.children);
            } else {
                entries.push(child);
            }
        });

        return entries;
    }
}
//#endregion
