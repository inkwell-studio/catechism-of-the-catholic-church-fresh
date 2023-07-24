import { ArticleParagraph } from './article-paragraph.ts';
import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { InBrief } from './in-brief.ts';
import { Paragraph } from './paragraph.ts';
import { ParagraphGroup } from './paragraph-group.ts';
import { Subarticle } from './subarticle.ts';
import { TextContent } from './text-content.ts';
import { TextKey } from './text-key.ts';

export interface Article extends ContentBase, ContentContainer {
    readonly contentType: Content.ARTICLE;
    readonly articleNumber: number;
    readonly title: TextKey;
    readonly openingContent: Array<ParagraphGroup | Paragraph | TextContent>;
    readonly mainContent: Array<ArticleParagraph | Subarticle | ParagraphGroup | Paragraph>;
    readonly finalContent: Array<ParagraphGroup>;
    readonly inBrief: InBrief | null;
}
