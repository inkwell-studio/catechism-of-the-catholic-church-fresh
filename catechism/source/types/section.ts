import { Article } from './article.ts';
import { Chapter } from './chapter.ts';
import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { ParagraphGroup } from './paragraph-group.ts';
import { TextContent } from './text-content.ts';
import { TextKey } from './text-key.ts';

export type Section = ContentBase & ContentContainer & {
    readonly contentType: Content.SECTION;
    readonly sectionNumber: number;
    readonly title: TextKey;
    readonly mainContent: Array<Chapter | Article>;
    readonly openingContent: Array<ParagraphGroup | TextContent>;
};
