import { Article } from './article.ts';
import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { Subarticle } from './subarticle.ts';
import { TextContent } from './text-content.ts';
import { TextKey } from './text-key.ts';

export type Chapter = ContentBase & ContentContainer & {
    readonly contentType: Content.CHAPTER;
    readonly chapterNumber: number;
    readonly title: TextKey;
    readonly mainContent: Array<Article | Subarticle>;
    readonly openingContent: Array<TextContent>;
};
