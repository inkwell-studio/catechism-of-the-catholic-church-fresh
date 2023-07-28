import { buildArticle } from './article.ts';
import { getTitleText } from './general.ts';
import { buildInBrief } from './in-brief.ts';
import { buildTextContent } from './text-content.ts';
import { Limits, Probability } from '../config.ts';
import { chance, intArrayOfRandomLength, randomBoolean } from '../../utils.ts';
import { Article, Chapter, Content, InBrief, Subarticle, TextContent, TextKey } from '../../../source/types/types.ts';

export function buildChapter(chapterNumber: number): Chapter {
    const openingContent = randomBoolean() ? buildOpeningContent() : [];

    return {
        contentType: Content.CHAPTER,
        // This will be set later, after all content is created
        pathID: '0',
        chapterNumber,
        title: getTitleText(Content.CHAPTER, chapterNumber) as TextKey,
        openingContent,
        mainContent: buildContent(),
        finalContent: [],
        inBrief: buildInBriefHelper(),
    };
}

function buildContent(): Array<Article | Subarticle> {
    return intArrayOfRandomLength(Limits.chapter.article).map((i) => buildArticle(i));
}

function buildOpeningContent(): Array<TextContent> {
    return intArrayOfRandomLength(Limits.chapter.openingContent.textContent).map(() => buildTextContent(true));
}

function buildInBriefHelper(): InBrief | null {
    return chance(Probability.chapter.inBrief) ? buildInBrief() : null;
}
