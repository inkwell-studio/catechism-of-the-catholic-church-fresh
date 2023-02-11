import { BlockQuote } from './block-quote.ts';
import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { TextContainer } from './text-container.ts';

export type Paragraph = ContentBase & ContentContainer & {
    readonly contentType: Content.PARAGRAPH;
    readonly paragraphNumber: number;
    // Paragraphs are considered to be supplementary if they are historical or apologetic in nature, or if they are supplementary doctrinal explanations (see §20).
    readonly supplementary: boolean;
    readonly mainContent: Array<BlockQuote | TextContainer>;
};
