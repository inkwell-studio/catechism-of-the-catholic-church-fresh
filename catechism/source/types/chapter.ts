import { Article } from './article.ts';
import { ChapterSection } from './chapter-section.ts';
import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { InBrief } from './in-brief.ts';
import { Paragraph } from './paragraph.ts';
import { ParagraphGroup } from './paragraph-group.ts';
import { Subarticle } from './subarticle.ts';
import { TextContent } from './text-content.ts';
import { TextKey } from './text-key.ts';

export interface Chapter extends ContentBase, ContentContainer {
    readonly contentType: Content.CHAPTER;
    readonly chapterNumber: number;
    readonly title: TextKey;
    readonly openingContent: Array<ChapterSection | ParagraphGroup | Paragraph | TextContent>;
    readonly mainContent: Array<Article | Subarticle>;
    readonly inBrief: InBrief | null;
}
