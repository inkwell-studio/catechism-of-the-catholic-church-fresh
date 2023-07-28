import { getTitleText } from './general.ts';
import { buildParagraph } from './paragraph.ts';
import { Limits } from '../config.ts';
import { intArrayOfRandomLength } from '../../utils.ts';
import { Content, Paragraph, ParagraphGroup, TextKey } from '../../../source/types/types.ts';

export function buildParagraphGroup(index: number): ParagraphGroup {
    return {
        contentType: Content.PARAGRAPH_GROUP,
        // This will be set later, after all content is created
        pathID: '0',
        paragraphGroupNumber: 1,
        title: getTitleText(Content.PARAGRAPH_GROUP, index) as TextKey,
        openingContent: [],
        mainContent: buildContent(),
        finalContent: [],
        // These are set later, after all content is created
        paragraphReferences: [],
    };
}

function buildContent(): Array<Paragraph> {
    return intArrayOfRandomLength(Limits.paragraphGroup.text).map(() => buildParagraph());
}
