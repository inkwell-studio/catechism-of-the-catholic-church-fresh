import { Content } from './content.ts';
import { InBrief } from './in-brief.ts';
import { InBriefContainer } from './in-brief-container.ts';
import { Paragraph } from './paragraph.ts';
import { Subarticle } from './subarticle.ts';
import { TextKey } from './text-key.ts';

export interface ArticleParagraph extends InBriefContainer {
    readonly contentType: Content.ARTICLE_PARAGRAPH;
    readonly articleParagraphNumber: number;
    readonly title: TextKey;
    readonly openingContent: Array<Paragraph>;
    readonly mainContent: Array<Subarticle>;
    readonly finalContent: Array<never>;
    readonly inBrief: InBrief;
}
