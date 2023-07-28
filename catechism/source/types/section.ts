import { Article } from './article.ts';
import { Chapter } from './chapter.ts';
import { Content } from './content.ts';
import { ContentContainer } from './content-container.ts';
import { InBrief } from './in-brief.ts';
import { Paragraph } from './paragraph.ts';
import { ParagraphGroup } from './paragraph-group.ts';
import { TextKey } from './text-key.ts';

export interface Section extends ContentContainer {
    readonly contentType: Content.SECTION;
    readonly sectionNumber: number;
    readonly title: TextKey;
    readonly openingContent: Array<ParagraphGroup | Paragraph | InBrief>;
    readonly mainContent: Array<Chapter | Article>;
    readonly finalContent: Array<never>;
}
