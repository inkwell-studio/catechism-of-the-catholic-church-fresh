import { buildTextBlock } from './text-block.ts';
import { Limits } from '../config.ts';
import { intArrayOfRandomLength } from '../../utils.ts';
import { Content, Paragraph, ParagraphSubitemContainer, TextBlock } from '../../../source/types/types.ts';

export function buildParagraph(): Paragraph {
    return {
        contentType: Content.PARAGRAPH,
        // This will be set later, after all content is created
        pathID: '0',
        // This will be set later, after all content is created
        paragraphNumber: 1,
        openingContent: [],
        mainContent: buildContent(),
        finalContent: [],
    };
}

function buildContent(): Array<ParagraphSubitemContainer | TextBlock> {
    return intArrayOfRandomLength(Limits.paragraph.textBlocks).map(() => buildTextBlock());
}
