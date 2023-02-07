import { ArticleParagraph } from './article-paragraph.ts';
import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { InBrief } from './in-brief.ts';
import { ParagraphGroup } from './paragraph-group.ts';
import { Subarticle } from './subarticle.ts';
import { TextContent } from './text-content.ts';
import { TextKey } from './text-key.ts';

export type Article = ContentBase & ContentContainer & {
    readonly contentType: Content.ARTICLE;
    readonly articleNumber: number;
    readonly title: TextKey;
    readonly mainContent: Array<ArticleParagraph | Subarticle | ParagraphGroup | InBrief>;
    readonly openingContent: Array<TextContent>;
};
