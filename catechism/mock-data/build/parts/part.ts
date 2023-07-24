import { Limits, Probability } from '../config.ts';
import { getTitleText } from './general.ts';
import { buildParagraphGroup } from './paragraph-group.ts';
import { buildSection } from './section.ts';
import { chance, intArrayOfRandomLength, randomBoolean } from '../../utils.ts';
import { Content, Paragraph, ParagraphGroup, Part, Section, TextKey } from '../../../source/types/types.ts';
import { buildParagraph } from './paragraph.ts';

export function buildPart(partNumber: number): Part {
    const openingContent = buildOpeningContent();
    const mainContent = buildSections();

    return {
        contentType: Content.PART,
        pathID: `${partNumber}`,
        partNumber,
        title: getTitleText(Content.PART, partNumber) as TextKey,
        openingContent,
        mainContent,
    };
}

function buildOpeningContent(): Array<ParagraphGroup | Paragraph> {
    if (chance(Probability.part.hasOpeningContent)) {
        const useParagraphGroups = randomBoolean();
        return useParagraphGroups
            ? intArrayOfRandomLength(Limits.part.openingContent).map((i) => buildParagraphGroup(i))
            : intArrayOfRandomLength(Limits.part.openingContent).map(() => buildParagraph());
    } else {
        return [];
    }
}

function buildSections(): Array<Section> {
    const multipleSections = chance(Probability.part.multipleSections);
    if (multipleSections) {
        return intArrayOfRandomLength(Limits.part.multipleSections).map((i) => buildSection(i));
    } else {
        return [buildSection(1)];
    }
}
