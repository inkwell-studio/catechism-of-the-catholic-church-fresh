import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { Subarticle } from './subarticle.ts';
import { TextKey } from './text-key.ts';

export type ArticleParagraph = ContentBase & ContentContainer & {
    readonly contentType: Content.ARTICLE_PARAGRAPH;
    readonly articleParagraphNumber: number;
    readonly title: TextKey;
    readonly mainContent: Array<Subarticle>;
};
