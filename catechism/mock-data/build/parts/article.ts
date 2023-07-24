import { buildArticleParagraph } from './article-paragraph.ts';
import { getTitleText } from './general.ts';
import { buildInBrief } from './in-brief.ts';
import { buildParagraph } from './paragraph.ts';
import { buildParagraphGroup } from './paragraph-group.ts';
import { buildSubarticle } from './subarticle.ts';
import { buildTextContent } from './text-content.ts';
import { Limits, Probability } from '../config.ts';
import { chance, intArrayOfRandomLength } from '../../utils.ts';
import {
    Article,
    ArticleParagraph,
    Content,
    InBrief,
    Paragraph,
    ParagraphGroup,
    Subarticle,
    TextContent,
    TextKey,
} from '../../../source/types/types.ts';

export function buildArticle(articleNumber: number): Article {
    return {
        contentType: Content.ARTICLE,
        // This will be set later, after all content is created
        pathID: '0',
        articleNumber,
        title: getTitleText(Content.ARTICLE, articleNumber) as TextKey,
        openingContent: buildOpeningContent(),
        mainContent: buildContent(),
        finalContent: buildFinalContent(),
        inBrief: buildInBriefHelper(),
    };
}

function buildOpeningContent(): Array<TextContent> {
    return intArrayOfRandomLength(Limits.article.textContent).map(() => buildTextContent(false));
}

function buildContent(): Array<ArticleParagraph | Subarticle | ParagraphGroup | Paragraph> {
    const content = [];

    const useOnlyParagraphGroupsAndParagraphs = chance(Probability.article.useOnlyParagraphGroupsAndParagraphs);
    if (useOnlyParagraphGroupsAndParagraphs) {
        const paragraphs = intArrayOfRandomLength(Limits.article.paragraphs).map(() => buildParagraph());

        const paragraphGroups = intArrayOfRandomLength(Limits.article.paragraphGroups).map((i) =>
            buildParagraphGroup(i)
        );

        content.push(...paragraphs, ...paragraphGroups);
    } else {
        const useArticleParagraphs = chance(Probability.article.useArticleParagraphs);
        if (useArticleParagraphs) {
            const articleParagraphs = intArrayOfRandomLength(Limits.article.articleParagraph).map((i) =>
                buildArticleParagraph(i)
            );
            content.push(...articleParagraphs);
        } else {
            content.push(...buildSubarticles());
        }
    }

    return content;
}

function buildFinalContent(): Array<ParagraphGroup> {
    return intArrayOfRandomLength(Limits.article.finalParagraphGroups).map((i) => buildParagraphGroup(i));
}

function buildSubarticles(): Array<Subarticle> {
    return intArrayOfRandomLength(Limits.article.subarticle).map((i) => buildSubarticle(i));
}

function buildInBriefHelper(): InBrief | null {
    return chance(Probability.article.hasInBrief) ? buildInBrief() : null;
}
