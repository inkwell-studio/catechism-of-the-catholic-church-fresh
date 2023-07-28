import { buildChapter } from './chapter.ts';
import { getTitleText } from './general.ts';
import { buildInBrief } from './in-brief.ts';
import { buildParagraph } from './paragraph.ts';
import { buildParagraphGroup } from './paragraph-group.ts';
import { Limits, Probability } from '../config.ts';
import { chance, intArrayOfRandomLength, randomBoolean } from '../../utils.ts';
import {
    Article,
    Chapter,
    Content,
    InBrief,
    Paragraph,
    ParagraphGroup,
    Section,
    TextKey,
} from '../../../source/types/types.ts';

export function buildSection(index: number): Section {
    const openingContent = chance(Probability.section.hasOpeningText) ? buildOpeningContent() : [];

    return {
        contentType: Content.SECTION,
        pathID: `${index}`,
        sectionNumber: index,
        title: getTitleText(Content.SECTION, index) as TextKey,
        openingContent,
        mainContent: buildContent(),
        finalContent: [],
    };
}

function buildContent(): Array<Chapter | Article> {
    const multipleChapters = chance(Probability.section.multipleChapters);
    if (multipleChapters) {
        return intArrayOfRandomLength(Limits.section.multipleChapters).map((i) => buildChapter(i));
    } else {
        return [buildChapter(1)];
    }
}

function buildOpeningContent(): Array<ParagraphGroup | Paragraph | InBrief> {
    const content: Array<ParagraphGroup | Paragraph | InBrief> = intArrayOfRandomLength(Limits.section.openingContent)
        .map((i) => randomBoolean() ? buildParagraph() : buildParagraphGroup(i));

    const hasInBrief = chance(Probability.section.hasInBrief);
    if (hasInBrief) {
        content.push(buildInBrief());
    }

    return content;
}
