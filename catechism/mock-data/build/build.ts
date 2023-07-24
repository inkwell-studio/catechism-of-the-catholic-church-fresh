// deno-lint-ignore-file
import { Limits, Probability } from './config.ts';
import { buildPart } from './parts/part.ts';
import { buildPrologue } from './parts/prologue.ts';
import { chance, intArrayOfRandomLength, MinMax, randomInt } from '../utils.ts';
import { CatechismStructure, Content, ContentBase, ContentContainer } from '../../source/types/types.ts';
import { NumberOrNumberRange } from '../../source/types/number-or-number-range.ts';
import { PathID } from '../../source/types/path-id.ts';
import { getAllParagraphs, getOpeningAndMainContent, hasMainContent, hasOpeningContent } from '../../utils.ts';

//#region top-level functions
export function buildMockData(): CatechismStructure {
    console.log('\nBuilding mock data...');

    let catechism = {
        prologue: buildPrologue('0'),
        parts: [
            buildPart(1),
            buildPart(2),
            buildPart(3),
        ],
    };

    catechism = setPathIDs(catechism);
    catechism = setParagraphNumbers(catechism);

    console.log('Validating mock data...');
    const valid = validateCatechism(catechism);
    if (!valid) {
        console.log('\nExiting without writing data.');
        Deno.exit(-1);
    }

    console.log('Creating cross references...');
    const results = buildParagraphCrossReferences(catechism);
    catechism = results.catechism;

    const paragraphCount = getAllParagraphs(catechism).length;
    console.log(`\nFinished: built ${paragraphCount} paragraphs with ${results.crossReferenceCount} cross references`);

    return catechism;
}
//#endregion

//#region helper functions
function setPathIDs(catechism: CatechismStructure): CatechismStructure {
    catechism = structuredClone(catechism);

    const prologuePathID = '0';
    (catechism.prologue as any).pathID = prologuePathID;

    const offset = catechism.prologue.openingContent.length;
    (catechism.prologue as any).openingContent = setPathIDsHelper(catechism.prologue.openingContent, prologuePathID);
    (catechism.prologue as any).mainContent = setPathIDsHelper(catechism.prologue.mainContent, prologuePathID, offset);

    catechism.parts.forEach((part, index) => {
        const pathID: PathID = `${index + 1}`;
        (part as any).pathID = pathID;
        (part as any).openingContent = setPathIDsHelper(part.openingContent, pathID);

        const openingContentOffset = part.openingContent.length;
        (part as any).mainContent = setPathIDsHelper(part.mainContent, pathID, openingContentOffset);
    });

    return catechism;
}

function setPathIDsHelper<T extends ContentBase>(
    content: Array<T>,
    parentPathID: PathID,
    offset: number = 0,
): Array<T> {
    content.forEach((c, index) => {
        const pathID = getPathID(index + offset, parentPathID);
        (c as any).pathID = pathID;

        let openingContentOffset = 0;
        if (hasOpeningContent(c)) {
            (c as any).openingContent = setPathIDsHelper((c as any).openingContent, pathID);
            openingContentOffset = (c as any).openingContent.length;
        }

        if (hasMainContent(c)) {
            (c as any).mainContent = setPathIDsHelper((c as any).mainContent, pathID, openingContentOffset);
        }
    });

    return content;
}

function getPathID(index: number, parentPathID: PathID): PathID {
    return `${parentPathID}-${index}` as PathID;
}

function setParagraphNumbers(catechism: CatechismStructure): CatechismStructure {
    catechism = structuredClone(catechism);

    const prologueResults = setParagraphNumbersHelper([catechism.prologue], 1);
    (catechism as any).prologue = prologueResults.content[0];

    const partsResults = setParagraphNumbersHelper(catechism.parts, prologueResults.nextParagraphNumber);
    (catechism as any).parts = partsResults.content;

    return catechism;
}

function setParagraphNumbersHelper<T extends ContentBase & ContentContainer>(
    content: Array<T>,
    nextParagraphNumber: number,
): { content: Array<T>; nextParagraphNumber: number } {
    content.forEach((c) => {
        if (Content.PARAGRAPH === c.contentType) {
            (c as any)['paragraphNumber'] = nextParagraphNumber++;
        } else if (hasMainContent(c)) {
            const mainAndOpeningContent = getOpeningAndMainContent(c);
            const results = setParagraphNumbersHelper(mainAndOpeningContent, nextParagraphNumber);
            nextParagraphNumber = results.nextParagraphNumber;

            return {
                content: results.content,
                nextParagraphNumber,
            };
        }
    });

    return { content, nextParagraphNumber };
}

function validateCatechism(catechism: CatechismStructure): boolean {
    function fail(message: string): false {
        console.log(`\nVALIDATION FAILURE: ${message}`);
        return false;
    }

    const paragraphNumbers = getAllParagraphs(catechism).map((p) => p.paragraphNumber);
    const uniqueParagraphNumbers = new Set(paragraphNumbers);

    const numParagraphs = paragraphNumbers.length;
    const numUniqueParagraphNumbers = uniqueParagraphNumbers.size;
    if (numParagraphs !== numUniqueParagraphNumbers) {
        return fail(
            `Duplicate paragraph numbers exist (${numParagraphs} paragraphs, but only ${numUniqueParagraphNumbers} paragraph numbers)`,
        );
    }

    const finalParagraphNumber = Math.max(...uniqueParagraphNumbers);
    if (finalParagraphNumber !== numParagraphs) {
        return fail(
            `The final paragraph number is incorrect: expected ${numParagraphs}, found ${finalParagraphNumber}`,
        );
    }

    return true;
}

function buildParagraphCrossReferences(
    catechism: CatechismStructure,
): { catechism: CatechismStructure; crossReferenceCount: number } {
    catechism = structuredClone(catechism);

    const paragraphNumbers = getAllParagraphs(catechism).map((p) => p.paragraphNumber);
    const maxParagraphNumber = Math.max(...paragraphNumbers);

    const prologueResults = helper([catechism.prologue], maxParagraphNumber, 0);
    (catechism as any).prologue = prologueResults.content[0];

    const partsResults = helper(catechism.parts, maxParagraphNumber, prologueResults.crossReferenceCount);
    (catechism as any).parts = partsResults.content;

    return {
        catechism,
        crossReferenceCount: partsResults.crossReferenceCount,
    };

    function helper<T extends ContentBase & ContentContainer>(
        content: Array<T>,
        maxParagraphNumber: number,
        crossReferenceCount: number,
    ): { content: Array<T>; crossReferenceCount: number } {
        content.forEach((c) => {
            // Only build cross references for paragraphs outside of the "In Brief" sections
            const properContent = Content.PARAGRAPH_GROUP === c.contentType || Content.TEXT_WRAPPER === c.contentType;
            if (properContent && chance(Probability.crossReference.create)) {
                const references = buildReferences(maxParagraphNumber);
                (c as any)['paragraphReferences'] = references;
                crossReferenceCount += references.length;
            } else if (Content.IN_BRIEF !== c.contentType && hasMainContent(c)) {
                const mainAndOpeningContent = getOpeningAndMainContent(c);

                const results = helper(
                    mainAndOpeningContent,
                    maxParagraphNumber,
                    crossReferenceCount,
                );
                crossReferenceCount = results.crossReferenceCount;

                return results;
            }
        });

        return { content, crossReferenceCount };
    }

    function buildReferences(maxParagraphNumber: number): Array<NumberOrNumberRange> {
        return chance(Probability.crossReference.multiple)
            ? buildMultipleReferences(maxParagraphNumber)
            : [buildReference(maxParagraphNumber)];
    }

    function buildMultipleReferences(maxParagraphNumber: number): Array<NumberOrNumberRange> {
        return intArrayOfRandomLength(Limits.paragraph.crossReference.count).map((i) =>
            buildReference(maxParagraphNumber)
        );
    }

    function buildReference(maxParagraphNumber: number): NumberOrNumberRange {
        const buildRange = chance(Probability.crossReference.range);
        const paragraphLimits: MinMax = { min: 1, max: maxParagraphNumber };

        if (buildRange) {
            const num1 = randomInt(paragraphLimits);
            const num2 = num1 + randomInt(Limits.paragraph.crossReference.range);
            return `${num1}-${num2}`;
        } else {
            return randomInt(paragraphLimits);
        }
    }
}
//#endregion
