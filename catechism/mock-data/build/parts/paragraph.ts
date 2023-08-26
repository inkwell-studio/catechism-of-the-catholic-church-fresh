import { buildTextBlock } from './text-block.ts';
import { Limit } from '../config/limit.ts';
import { intArrayOfRandomLength } from '../utils.ts';
import { Content, Paragraph, ParagraphSubitemContainer, TextBlock } from '../../../source/types/types.ts';

export function buildParagraph(): Paragraph {
    return {
        contentType: Content.PARAGRAPH,
        // This will be set later, after all content is created
        pathID: '0',
        // This will be set later, after all content is created
        semanticPath: '',
        // This will be set later, after all content is created
        paragraphNumber: 1,
        openingContent: [],
        mainContent: buildContent(),
        finalContent: [],
    };
}

function buildContent(): Array<ParagraphSubitemContainer | TextBlock> {
    return intArrayOfRandomLength(Limit.paragraph.textBlock).map(() => buildTextBlock());
}
