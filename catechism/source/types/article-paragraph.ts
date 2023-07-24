import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { InBrief } from './in-brief.ts';
import { Paragraph } from './paragraph.ts';
import { Subarticle } from './subarticle.ts';
import { TextKey } from './text-key.ts';

export interface ArticleParagraph extends ContentBase, ContentContainer {
    readonly contentType: Content.ARTICLE_PARAGRAPH;
    readonly articleParagraphNumber: number;
    readonly title: TextKey;
    readonly openingContent: Array<Paragraph>;
    readonly mainContent: Array<Subarticle>;
    readonly inBrief: InBrief;
}
