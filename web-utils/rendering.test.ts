import { assert, assertEquals, assertExists, assertStrictEquals } from '$deno/testing/asserts.ts';

import { setPathIDs } from '../catechism/mock-data/build/build.ts';
import { InBrief } from '../catechism/source/types/in-brief.ts';
import {
    Article,
    ArticleParagraph,
    CatechismStructure,
    Chapter,
    Content,
    ContentBase,
    ContentContainer,
    InBriefContainer,
    Paragraph,
    ParagraphGroup,
    Part,
    Prologue,
    Section,
    Subarticle,
    Text,
    TextBlock,
    TextWrapper,
} from '../catechism/source/types/types.ts';
import { hasInBrief } from '../catechism/source/utils/content.ts';
import { getContentForRendering } from './rendering.ts';

//#region getContentForRendering()
//#region testing helpers
function getFirstChild(content: ContentBase): ContentBase {
    return (content as ContentContainer).mainContent[0];
}

function getMiddleChild(content: ContentBase): ContentBase {
    assert(
        (content as ContentContainer).mainContent.length > 2,
        `content expected to have more than two main-content children, PathID ${content.pathID}`,
    );
    return (content as ContentContainer).mainContent[1];
}

function getLastChild(content: ContentBase): ContentBase {
    assert(
        (content as ContentContainer).mainContent.length > 2,
        `content expected to have more than two main-content children, PathID ${content.pathID}`,
    );
    const child = (content as ContentContainer).mainContent.at(-1);
    assert(!!child, `content expected to have an actual last main-content child, PathID ${content.pathID}`);
    return child;
}

function getFinalContentChild(content: ContentBase): ContentBase {
    return (content as ContentContainer).finalContent[0];
}

function getInBrief(content: ContentBase): InBrief {
    const inBrief = (content as InBriefContainer).inBrief;
    assertExists(inBrief, `In Brief content not found where expected (pathID ${content.pathID})`);
    return inBrief;
}

function assertType(content: ContentBase, contentType: Content): void {
    assertStrictEquals(
        content.contentType,
        contentType,
        `incorrect content: found ${content.contentType} instead of ${contentType}`,
    );
}

function assertContentIsNotTrimmed(content: ContentBase): void {
    assertHasChildren(content as ContentContainer, 'opening');
    assertHasChildren(content as ContentContainer, 'main');

    if (Content.ARTICLE === content.contentType) {
        assertHasChildren(content as ContentContainer, 'final');
    }

    const shouldHaveInBrief = [Content.CHAPTER, Content.ARTICLE, Content.ARTICLE_PARAGRAPH].includes(
        content.contentType,
    );
    if (shouldHaveInBrief) {
        assertHasInBrief(content);
    }
}

function assertHasChildren(content: ContentContainer, container: 'opening' | 'main' | 'final'): void {
    let numChildren = 0;

    switch (container) {
        case 'opening': {
            numChildren = content.openingContent.length;
            break;
        }
        case 'main': {
            numChildren = content.mainContent.length;
            break;
        }
        case 'final': {
            numChildren = content.finalContent.length;
            break;
        }
    }

    assert(
        numChildren > 2,
        `content should have more than 2 ${container}-content children, but has ${numChildren} instead (${content.contentType}, PathID ${content.pathID})`,
    );
}

function assertHasInBrief(content: ContentBase): void {
    assertExists(
        (content as InBriefContainer).inBrief,
        `content should have In Brief content (${content.contentType}, PathID ${content.pathID})`,
    );
}

function assertTrimmedContent(content: ContentContainer): void {
    const expectTrimmedContent = contentShouldBeTrimmed(content);
    if (expectTrimmedContent) {
        test(content);
    }

    function test(c: ContentContainer): void {
        assertHasSingleMainChild(c);
        assertHasNoFinalContent(c);
        assertHasNoInBrief(c);

        const firstMainChild = c.mainContent[0] as ContentContainer;
        const expectTrimmedContent = contentShouldBeTrimmed(firstMainChild);
        if (expectTrimmedContent) {
            test(firstMainChild);
        }
    }
}

function contentShouldBeTrimmed(c: ContentContainer): boolean {
    const isTopLevelContent = [Content.PROLOGUE, Content.PART, Content.SECTION].includes(c.contentType);
    const isChapterWithArticles = Content.CHAPTER === c.contentType &&
        Content.ARTICLE === c.mainContent[0].contentType;
    const isArticleWithArticleParagraphs = Content.ARTICLE === c.contentType &&
        Content.ARTICLE_PARAGRAPH === c.mainContent[0].contentType;

    return isTopLevelContent || isChapterWithArticles || isArticleWithArticleParagraphs;
}

function assertContentHasOnlyEndingContent(article: Article, originalArticle: Article): void {
    assertHasSingleMainChild(article);
    assertEquals(
        article.mainContent[0],
        getLastChild(originalArticle),
        `Article does not have the correct main-content child`,
    );

    assertHasInBrief(article);
    assertHasChildren(article, 'final');
}

function assertHasSingleMainChild(content: ContentBase): void {
    const numChildren = (content as ContentContainer).mainContent.length;
    assertStrictEquals(
        numChildren,
        1,
        `content should have a single main-content child, but has ${numChildren} (${content.contentType}, PathID ${content.pathID})`,
    );
}

function assertHasNoFinalContent(content: ContentBase): void {
    const numChildren = (content as ContentContainer).finalContent.length;
    assertStrictEquals(
        numChildren,
        0,
        `content should have no final-content children, but has ${numChildren} (${content.contentType}, PathID ${content.pathID})`,
    );
}

function assertHasNoInBrief(content: ContentBase): void {
    assert(
        !hasInBrief(content),
        `content should not have In Brief content (${content.contentType}, PathID ${content.pathID})`,
    );
}
//#endregion

//#region tests
console.log('content retrieval ...');

Deno.test('getContentForRendering() | Prologue | the entire Prologue is loaded', () => {
    const catechism = buildCatechism();
    const content = getContentForRendering(catechism.prologue.pathID, catechism);
    assertStrictEquals(content.contentType, Content.PROLOGUE);
    assertEquals(content, catechism.prologue);
});

Deno.test('getContentForRendering() | Prologue child | the entire Prologue is loaded', () => {
    const catechism = buildCatechism();
    const content = getContentForRendering(catechism.prologue.mainContent[0]?.pathID, catechism);
    assertStrictEquals(content.contentType, Content.PROLOGUE);
    assertEquals(content, catechism.prologue);
});

Deno.test('getContentForRendering() | Part | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    // the test
    const part = getContentForRendering(testPart.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Section (first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    // the test
    const part = getContentForRendering(testSection.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Section with high-level content (subsequent child of Part) | the Section is returned trimmed', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    // the test
    const section = getContentForRendering(testSection.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | Section with Paragraph Groups (subsequent child of Part) | the Section is returned untrimmed', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.PARAGRAPH_GROUP);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    // the test
    const section = getContentForRendering(testSection.pathID, catechism);
    assertType(section, Content.SECTION);
    assertContentIsNotTrimmed(section);
});

Deno.test('getContentForRendering() | In Brief of Section with Paragraph Groups (subsequent child of Part) | the Section is returned untrimmed', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.PARAGRAPH_GROUP);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testInBrief = getInBrief(testSection);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const section = getContentForRendering(testInBrief.pathID, catechism);
    assertType(section, Content.SECTION);
    assertContentIsNotTrimmed(section);
});

Deno.test('getContentForRendering() | Chapter (first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);

    // the test
    const part = getContentForRendering(testChapter.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Chapter (first child of Section, subsequent child of Part) | the Section is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);

    // the test
    const section = getContentForRendering(testChapter.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | Chapter (with Articles) (subsequent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);

    // the test
    const chapter = getContentForRendering(testChapter.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertTrimmedContent(chapter);
});

Deno.test('getContentForRendering() | Chapter (with Subarticles) (subsequent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);

    // the test
    const chapter = getContentForRendering(testChapter.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertContentIsNotTrimmed(chapter);
});

Deno.test('getContentForRendering() | Article (first child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);

    // the test
    const part = getContentForRendering(testArticle.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Article (first child of Chapter, first child of Section, subsequent child of Part) | the Section is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);

    // the test
    const section = getContentForRendering(testArticle.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | Article (first child of Chapter, subsequent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);

    // the test
    const chapter = getContentForRendering(testArticle.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertTrimmedContent(chapter);
});

Deno.test('getContentForRendering() | Article (with Article Paragraphs) (subsequent child of Chapter) | the Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);

    // the test
    const article = getContentForRendering(testArticle.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertTrimmedContent(article);
});

Deno.test('getContentForRendering() | Article (with Subarticles) (subsequent child of Chapter) | the Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);

    // the test
    const article = getContentForRendering(testArticle.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertContentIsNotTrimmed(article);
});

Deno.test('getContentForRendering() | Article Paragraph (first child of Article, first child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);

    // the test
    const part = getContentForRendering(testArticleParagraph.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Article Paragraph (first child of Article, first child of Chapter, first child of Section, subsequent child of Part) | the Section is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);

    // the test
    const section = getContentForRendering(testArticleParagraph.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | Article Paragraph (first child of Article, first child of Chapter, subsequent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);

    // the test
    const chapter = getContentForRendering(testArticleParagraph.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertTrimmedContent(chapter);
});

Deno.test('getContentForRendering() | Article Paragraph (first child of Article, subsequent child of Chapter) | the Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);

    // the test
    const article = getContentForRendering(testArticleParagraph.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertTrimmedContent(article);
});

Deno.test('getContentForRendering() | Article Paragraph (subsequent child of Article) | the Article Paragraph is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getMiddleChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);

    // the test
    const articleParagraph = getContentForRendering(testArticleParagraph.pathID, catechism);
    assertType(articleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(articleParagraph);
});

Deno.test('getContentForRendering() | Subarticle (first child of Article Paragraph, first child of Article, first child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testSubarticle = getFirstChild(testArticleParagraph);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const part = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Subarticle (first child of Article Paragraph, first child of Article, first child of Chapter, first child of Section, subsequent child of Part) | the Section is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testSubarticle = getFirstChild(testArticleParagraph);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const section = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | Subarticle (first child of Article Paragraph, first child of Article, first child of Chapter, subsequent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testSubarticle = getFirstChild(testArticleParagraph);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const chapter = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertTrimmedContent(chapter);
});

Deno.test('getContentForRendering() | Subarticle (first child of Article Paragraph, first child of Article, subsequent child of Chapter) | the Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testSubarticle = getFirstChild(testArticleParagraph);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const article = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertTrimmedContent(article);
});

Deno.test('getContentForRendering() | Subarticle (first child of Article Paragraph, subsequent child of Article) | the Article Paragraph is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getMiddleChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testSubarticle = getFirstChild(testArticleParagraph);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const articleParagraph = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(articleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(articleParagraph);
});

Deno.test('getContentForRendering() | Subarticle (subsequent child of Article Paragraph, first child of Article, first child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testSubarticle = getMiddleChild(testArticleParagraph);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const part = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Subarticle (first child of Article, first child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testSubarticle = getFirstChild(testArticle);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const part = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Subarticle (first child of Article, first child of Chapter, first child of Section, subsequent child of Part) | the Section is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testSubarticle = getFirstChild(testArticle);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const section = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | Subarticle (first child of Article, first child of Chapter, subsequent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testSubarticle = getFirstChild(testArticle);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const chapter = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertTrimmedContent(chapter);
});

Deno.test('getContentForRendering() | Subarticle (first child of Article, subsequent child of Chapter) | the Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testSubarticle = getFirstChild(testArticle);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const article = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertContentIsNotTrimmed(article);
});

Deno.test('getContentForRendering() | Subarticle (subsequent child of Article, first child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testSubarticle = getMiddleChild(testArticle);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const part = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Subarticle (first child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testSubarticle = getFirstChild(testChapter);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const part = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | Subarticle (first child of Chapter, first child of Section, subsequent child of Part) | the Section is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testSubarticle = getFirstChild(testChapter);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const section = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | Subarticle (first child of Chapter, subsequent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testSubarticle = getFirstChild(testChapter);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const chapter = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertTrimmedContent(chapter);
});

Deno.test('getContentForRendering() | Subarticle (subsequent child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testSubarticle = getMiddleChild(testChapter);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const part = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | In Brief of Chapter (first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testInBrief = getInBrief(testChapter);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const part = getContentForRendering(testInBrief.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | In Brief of Chapter (first child of Section, subsequent child of Part) | the Section is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testInBrief = getInBrief(testChapter);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const section = getContentForRendering(testInBrief.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | In Brief of Chapter (subsequent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testInBrief = getInBrief(testChapter);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const chapter = getContentForRendering(testInBrief.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertTrimmedContent(chapter);
});

Deno.test('getContentForRendering() | In Brief of Article (first child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testInBrief = getInBrief(testArticle);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const part = getContentForRendering(testInBrief.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | In Brief of Article (first child of Chapter, first child of Section, subsequent child of Part) | the Section is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testInBrief = getInBrief(testArticle);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const section = getContentForRendering(testInBrief.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | In Brief of Article (first child of Chapter, subseqent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testInBrief = getInBrief(testArticle);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const chapter = getContentForRendering(testInBrief.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertTrimmedContent(chapter);
});

Deno.test('getContentForRendering() | In Brief of Article (with Article Paragraphs) (subsequent child of Chapter) | the Article is returned', () => {
    // This scenario (Articles with In Brief and Article Paragraph children) does not occur within the Catechism of the Catholic Church, but the behavior is specified here in case that changes

    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testInBrief = getInBrief(testArticle);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const article = getContentForRendering(testInBrief.pathID, catechism) as Article;
    assertType(article, Content.ARTICLE);
    assertContentHasOnlyEndingContent(article, testArticle);
});

Deno.test('getContentForRendering() | In Brief of Article (with Subarticles) (subsequent child of Chapter) | the Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testInBrief = getInBrief(testArticle);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const article = getContentForRendering(testInBrief.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertContentIsNotTrimmed(article);
});

Deno.test('getContentForRendering() | In Brief of Article Paragraph (first child of Article, first child of Chapter, first child of Section, first child of Part) | the Part is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testInBrief = getInBrief(testArticleParagraph);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const part = getContentForRendering(testInBrief.pathID, catechism);
    assertType(part, Content.PART);
    assertTrimmedContent(part);
});

Deno.test('getContentForRendering() | In Brief of Article Paragraph (first child of Article, first child of Chapter, first child of Section, subsequent child of Part) | the Section is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getMiddleChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testInBrief = getInBrief(testArticleParagraph);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const section = getContentForRendering(testInBrief.pathID, catechism);
    assertType(section, Content.SECTION);
    assertTrimmedContent(section);
});

Deno.test('getContentForRendering() | In Brief of Article Paragraph (first child of Article, first child of Chapter, subseqent child of Section) | the Chapter is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getMiddleChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testInBrief = getInBrief(testArticleParagraph);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const chapter = getContentForRendering(testInBrief.pathID, catechism);
    assertType(chapter, Content.CHAPTER);
    assertTrimmedContent(chapter);
});

Deno.test('getContentForRendering() | In Brief of Article Paragraph (first child of Article, subsequent child of Chapter) | the Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getFirstChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testInBrief = getInBrief(testArticleParagraph);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const article = getContentForRendering(testInBrief.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertTrimmedContent(article);
});

Deno.test('getContentForRendering() | In Brief of Article Paragraph (subsequent child of Article) | the Article Paragraph is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getFirstChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getMiddleChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(testArticleParagraph);
    assertHasInBrief(testArticleParagraph);

    const testInBrief = getInBrief(testArticleParagraph);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const articleParagraph = getContentForRendering(testInBrief.pathID, catechism);
    assertType(articleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(articleParagraph);
});

Deno.test('getContentForRendering() | Article with Article Paragraph children and no In Brief or Final Content: select last Article Paragraph | the Article Paragraph is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertHasChildren(testArticle, 'main');

    // deno-lint-ignore no-explicit-any
    (testArticle as any).inBrief = null;
    // deno-lint-ignore no-explicit-any
    (testArticle as any).finalContent = [];
    assertHasNoInBrief(testArticle);
    assertHasNoFinalContent(testArticle);

    const testArticleParagraph = getLastChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);

    // the test
    const articleParagraph = getContentForRendering(testArticleParagraph.pathID, catechism);
    assertType(articleParagraph, Content.ARTICLE_PARAGRAPH);
    assertContentIsNotTrimmed(articleParagraph);
});

Deno.test('getContentForRendering() | Article with In Brief and Final Content and Article Paragraph children: select last Article Paragraph | the Article with the last Article Paragraph, In Brief, and Final Content is returned', () => {
    // This scenario does not occur within the Catechism of the Catholic Church, but the behavior is specified here in case that changes

    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testArticleParagraph = getLastChild(testArticle);
    assertType(testArticleParagraph, Content.ARTICLE_PARAGRAPH);

    // the test
    const article = getContentForRendering(testArticleParagraph.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertContentHasOnlyEndingContent(article as Article, testArticle);
});

Deno.test('getContentForRendering() | Article with In Brief and Final Content and Article Paragraph children: select In Brief | the Article with the last Article Paragraph, In Brief, and Final Content is returned', () => {
    // This scenario does not occur within the Catechism of the Catholic Church, but the behavior is specified here in case that changes

    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testInBrief = getInBrief(testArticle);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const article = getContentForRendering(testInBrief.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertContentHasOnlyEndingContent(article as Article, testArticle);
});

Deno.test('getContentForRendering() | Article with In Brief and Final Content and Article Paragraph children: select Final Content | the Article with the last Article Paragraph, In Brief, and Final Content is returned', () => {
    // This scenario does not occur within the Catechism of the Catholic Church, but the behavior is specified here in case that changes

    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testParagraphGroup = getFinalContentChild(testArticle);
    assertType(testParagraphGroup, Content.PARAGRAPH_GROUP);

    // the test
    const article = getContentForRendering(testParagraphGroup.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertContentHasOnlyEndingContent(article as Article, testArticle);
});

Deno.test('getContentForRendering() | Article with Final Content and Subarticle children: select last Subarticle | entire Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testSubarticle = getLastChild(testArticle);
    assertType(testSubarticle, Content.SUB_ARTICLE);

    // the test
    const article = getContentForRendering(testSubarticle.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertContentIsNotTrimmed(article);
});

Deno.test('getContentForRendering() | Article with Final Content and Subarticle children: select In Brief | entire Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testInBrief = getInBrief(testArticle);
    assertType(testInBrief, Content.IN_BRIEF);

    // the test
    const article = getContentForRendering(testInBrief.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertContentIsNotTrimmed(article);
});

Deno.test('getContentForRendering() | Article with Final Content and Subarticle children: select Final Content | entire Article is returned', () => {
    // verify preconditions
    const catechism = buildCatechism();
    const testPart = getPart(catechism, Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE);
    assertType(testPart, Content.PART);
    assertContentIsNotTrimmed(testPart);

    const testSection = getFirstChild(testPart);
    assertType(testSection, Content.SECTION);
    assertContentIsNotTrimmed(testSection);

    const testChapter = getFirstChild(testSection);
    assertType(testChapter, Content.CHAPTER);
    assertContentIsNotTrimmed(testChapter);
    assertHasInBrief(testChapter);

    const testArticle = getMiddleChild(testChapter) as Article;
    assertType(testArticle, Content.ARTICLE);
    assertContentIsNotTrimmed(testArticle);
    assertHasInBrief(testArticle);

    const testParagraphGroup = getFinalContentChild(testArticle);
    assertType(testParagraphGroup, Content.PARAGRAPH_GROUP);

    // the test
    const article = getContentForRendering(testParagraphGroup.pathID, catechism);
    assertType(article, Content.ARTICLE);
    assertContentIsNotTrimmed(article);
});
//#endregion

//#region data helpers
enum Hierarchy {
    CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH = 'chapter__to__article__to__article_paragraph',
    CHAPTER__TO__ARTICLE__TO__SUBARTICLE = 'chapter__to__article__to__subarticle',
    CHAPTER__TO__SUBARTICLE = 'chapter__to__subarticle',
    ARTICLE__TO__ARTICLE_PARAGRAPH = 'article__to__article_paragraph',
    ARTICLE__TO__SUBARTICLE = 'article__to__subarticle',
    PARAGRAPH_GROUP = 'paragraph_group',
}

function buildCatechism(): CatechismStructure {
    const catechism: CatechismStructure = {
        prologue: buildPrologue(),
        parts: [
            buildPart(1),
            buildPart(2),
            buildPart(3),
            buildPart(4),
            buildPart(5),
            buildPart(6),
        ],
    };
    return setPathIDs(catechism);
}

// The logic here must match that of `buildPart()`
function getPart(catechism: CatechismStructure, hierarchy: Hierarchy): Part {
    switch (hierarchy) {
        case Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH: {
            return catechism.parts[0];
        }
        case Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE: {
            return catechism.parts[1];
        }
        case Hierarchy.CHAPTER__TO__SUBARTICLE: {
            return catechism.parts[2];
        }
        case Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH: {
            return catechism.parts[3];
        }
        case Hierarchy.ARTICLE__TO__SUBARTICLE: {
            return catechism.parts[4];
        }
        case Hierarchy.PARAGRAPH_GROUP: {
            return catechism.parts[5];
        }
    }
}

function buildPrologue(): Prologue {
    const openingContent = [buildTextBlock(), buildTextBlock(), buildTextBlock()];
    const mainContent = [buildSubarticle(), buildSubarticle(), buildSubarticle()];

    return {
        contentType: Content.PROLOGUE,
        pathID: '123456789',
        semanticPath: 'prologue',
        title: 'Prologue',
        openingContent,
        mainContent,
        finalContent: [],
    };
}

// The logic here must match that of `getPart()`
function buildPart(partNumber: number): Part {
    const openingContent = [buildParagraph(), buildParagraph(), buildParagraph()];
    const mainContent: Array<Section> = [];

    if (1 === partNumber) {
        mainContent.push(...[
            buildSection(Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH),
            buildSection(Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH),
            buildSection(Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH),
        ]);
    } else if (2 === partNumber) {
        mainContent.push(...[
            buildSection(Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE),
            buildSection(Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE),
            buildSection(Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE),
        ]);
    } else if (3 === partNumber) {
        mainContent.push(...[
            buildSection(Hierarchy.CHAPTER__TO__SUBARTICLE),
            buildSection(Hierarchy.CHAPTER__TO__SUBARTICLE),
            buildSection(Hierarchy.CHAPTER__TO__SUBARTICLE),
        ]);
    } else if (4 === partNumber) {
        mainContent.push(...[
            buildSection(Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH),
            buildSection(Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH),
            buildSection(Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH),
        ]);
    } else if (5 === partNumber) {
        mainContent.push(...[
            buildSection(Hierarchy.ARTICLE__TO__SUBARTICLE),
            buildSection(Hierarchy.ARTICLE__TO__SUBARTICLE),
            buildSection(Hierarchy.ARTICLE__TO__SUBARTICLE),
        ]);
    } else if (6 === partNumber) {
        mainContent.push(...[
            buildSection(Hierarchy.PARAGRAPH_GROUP),
            buildSection(Hierarchy.PARAGRAPH_GROUP),
            buildSection(Hierarchy.PARAGRAPH_GROUP),
        ]);
    }

    return {
        contentType: Content.PART,
        pathID: '123456789',
        semanticPath: `part-${partNumber}`,
        partNumber,
        title: `Part ${partNumber}`,
        openingContent,
        mainContent,
        finalContent: [],
        credo: null,
        tenCommandments: null,
    };
}

function buildSection(hierarchy: Hierarchy): Section {
    const openingContent = [buildParagraph(), buildParagraph(), buildParagraph()];
    let mainContent: Array<Chapter> | Array<Article> | Array<ParagraphGroup> = [];

    if (Hierarchy.CHAPTER__TO__SUBARTICLE === hierarchy) {
        mainContent = [
            buildChapter('subarticle'),
            buildChapter('subarticle'),
            buildChapter('subarticle'),
        ];
    } else if (Hierarchy.CHAPTER__TO__ARTICLE__TO__ARTICLE_PARAGRAPH === hierarchy) {
        mainContent = [
            buildChapter(Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH),
            buildChapter(Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH),
            buildChapter(Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH),
        ];
    } else if (Hierarchy.CHAPTER__TO__ARTICLE__TO__SUBARTICLE === hierarchy) {
        mainContent = [
            buildChapter(Hierarchy.ARTICLE__TO__SUBARTICLE),
            buildChapter(Hierarchy.ARTICLE__TO__SUBARTICLE),
            buildChapter(Hierarchy.ARTICLE__TO__SUBARTICLE),
        ];
    } else if (Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH === hierarchy) {
        mainContent = [
            buildArticle(true),
            buildArticle(true),
            buildArticle(true),
        ];
    } else if (Hierarchy.ARTICLE__TO__SUBARTICLE === hierarchy) {
        mainContent = [
            buildArticle(false),
            buildArticle(false),
            buildArticle(false),
        ];
    } else if (Hierarchy.PARAGRAPH_GROUP === hierarchy) {
        mainContent = [
            buildParagraphGroup(),
            buildParagraphGroup(),
            buildParagraphGroup(),
        ];
    }
    return {
        contentType: Content.SECTION,
        pathID: '123456789',
        semanticPath: '',
        sectionNumber: 123456789,
        title: 'Section',
        openingContent,
        mainContent,
        finalContent: [],
        inBrief: buildInBrief(),
    };
}

function buildChapter(
    descendents: Hierarchy | 'subarticle',
): Chapter {
    const openingContent = [buildParagraph(), buildParagraph(), buildParagraph()];
    let mainContent: Array<Article> | Array<Subarticle> = [];

    if (descendents === Hierarchy.ARTICLE__TO__ARTICLE_PARAGRAPH) {
        mainContent = [
            buildArticle(true),
            buildArticle(true),
            buildArticle(true),
        ];
    } else if (descendents === Hierarchy.ARTICLE__TO__SUBARTICLE) {
        mainContent = [
            buildArticle(false),
            buildArticle(false),
            buildArticle(false),
        ];
    } else if (descendents === 'subarticle') {
        mainContent = [
            buildSubarticle(),
            buildSubarticle(),
            buildSubarticle(),
        ];
    }

    return {
        contentType: Content.CHAPTER,
        pathID: '123456789',
        semanticPath: '',
        chapterNumber: 123456789,
        title: 'Chapter',
        openingContent,
        mainContent,
        finalContent: [],
        inBrief: buildInBrief(),
    };
}

function buildArticle(includeArticleParagraphs: boolean): Article {
    const openingContent = [buildParagraph(), buildParagraph(), buildParagraph()];
    const mainContent = includeArticleParagraphs
        ? [buildArticleParagraph(), buildArticleParagraph(), buildArticleParagraph()]
        : [buildSubarticle(), buildSubarticle(), buildSubarticle()];
    const finalContent = [buildParagraphGroup(), buildParagraphGroup(), buildParagraphGroup()];

    return {
        contentType: Content.ARTICLE,
        pathID: '123456789',
        semanticPath: '',
        articleNumber: 123456789,
        title: 'Article',
        openingContent,
        mainContent,
        finalContent,
        inBrief: buildInBrief(),
    };
}

function buildArticleParagraph(): ArticleParagraph {
    const openingContent = [buildParagraph(), buildParagraph(), buildParagraph()];
    const mainContent = [buildSubarticle(), buildSubarticle(), buildSubarticle()];

    return {
        contentType: Content.ARTICLE_PARAGRAPH,
        pathID: '123456789',
        semanticPath: '',
        articleParagraphNumber: 123456789,
        title: 'Article Paragraph',
        openingContent,
        mainContent,
        finalContent: [],
        inBrief: buildInBrief(),
    };
}

function buildSubarticle(): Subarticle {
    return {
        contentType: Content.SUB_ARTICLE,
        pathID: '123456789',
        semanticPath: '',
        subarticleNumber: 123456789,
        title: 'Subarticle',
        openingContent: [],
        mainContent: [],
        finalContent: [],
    };
}

function buildParagraphGroup(): ParagraphGroup {
    return {
        contentType: Content.PARAGRAPH_GROUP,
        pathID: '123456789',
        semanticPath: '',
        paragraphGroupNumber: 123456789,
        title: 'Paragraph Group',
        openingContent: [],
        mainContent: [],
        finalContent: [],
        paragraphReferences: [],
    };
}

function buildParagraph(): Paragraph {
    const mainContent = [buildTextBlock()];

    return {
        contentType: Content.PARAGRAPH,
        pathID: '123456789',
        semanticPath: '',
        paragraphNumber: 123456789,
        openingContent: [],
        mainContent,
        finalContent: [],
    };
}

function buildInBrief(): InBrief {
    return {
        contentType: Content.IN_BRIEF,
        pathID: '123456789',
        semanticPath: '',
        openingContent: [],
        mainContent: [],
        finalContent: [],
    };
}

function buildTextBlock(): TextBlock {
    const mainContent = [buildTextWrapper()];

    return {
        contentType: Content.TEXT_BLOCK,
        pathID: '123456789',
        semanticPath: '',
        supplementary: false,
        openingContent: [],
        mainContent,
        finalContent: [],
    };
}

function buildTextWrapper(): TextWrapper {
    const mainContent = [buildText()];

    return {
        contentType: Content.TEXT_WRAPPER,
        pathID: '123456789',
        semanticPath: '',
        openingContent: [],
        mainContent,
        finalContent: [],
        references: [],
        paragraphReferences: [],
    };
}

function buildText(): Text {
    return {
        contentType: Content.TEXT,
        pathID: '123456789',
        semanticPath: '',
        content: 'abc',
        strong: false,
        emphasis: false,
        smallCaps: false,
    };
}
//#endregion
//#endregion
