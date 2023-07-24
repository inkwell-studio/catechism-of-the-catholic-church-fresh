import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { TextBlock } from './text-block.ts';

export interface BlockQuote extends ContentBase, ContentContainer {
    readonly contentType: Content.BLOCK_QUOTE;
    readonly openingContent: Array<never>;
    readonly mainContent: Array<TextBlock>;
}
