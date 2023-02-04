import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { TextContainer } from './text-container.ts';

export type BlockQuote = ContentBase & ContentContainer & {
    readonly contentType: Content.BLOCK_QUOTE;
    readonly mainContent: Array<TextContainer>;
};
