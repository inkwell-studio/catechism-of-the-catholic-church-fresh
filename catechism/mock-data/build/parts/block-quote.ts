import { buildTextBlock } from './text-block.ts';
import { intArrayOfRandomLength } from '../../utils.ts';
import { BlockQuote, Content, TextBlock } from '../../../source/types/types.ts';
import { Limits } from '../config.ts';

export function buildBlockQuote(): BlockQuote {
    return {
        contentType: Content.BLOCK_QUOTE,
        // This will be set later, after all content is created
        pathID: '0',
        openingContent: [],
        mainContent: buildContent(),
    };
}

function buildContent(): Array<TextBlock> {
    return intArrayOfRandomLength(Limits.blockQuote.text).map(() => buildTextBlock());
}
