import { buildTextWrapper } from './text-wrapper.ts';
import { Limits, Probability } from '../config.ts';
import { chance, intArrayOfRandomLength } from '../../utils.ts';
import { Content, TextBlock, TextWrapper } from '../../../source/types/types.ts';

export function buildTextBlock(): TextBlock {
    const supplementary = chance(Probability.textBlock.supplementary);

    return {
        contentType: Content.TEXT_BLOCK,
        // This will be set later, after all content is created
        pathID: '0',
        supplementary,
        openingContent: [],
        mainContent: buildContent(),
        finalContent: [],
    };
}

function buildContent(): Array<TextWrapper> {
    return intArrayOfRandomLength(Limits.textBlock.textWrappers).map(() => buildTextWrapper());
}
