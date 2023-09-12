// deno-lint-ignore-file fresh-server-event-handlers

import { Fragment, JSX } from 'preact';

import {
    Article,
    ArticleParagraph,
    BlockQuote,
    Chapter,
    Content as ContentEnum,
    ContentBase,
    ContentContainer,
    InBrief,
    Language,
    Paragraph,
    ParagraphGroup,
    ParagraphSubitem,
    ParagraphSubitemContainer,
    Part,
    Prologue,
    Section,
    Subarticle,
    Text,
    TextBlock,
    TextWrapper,
} from '../../catechism/source/types/types.ts';
import {
    getAllChildContent,
    getFinalContent,
    getInBrief,
    getMainContent,
    getOpeningContent,
} from '../../catechism/source/utils/content.ts';
import { getUrlFragment } from '../../web/routing.ts';
import { translate } from '../../web/translation.ts';
import { NumberOrNumberRange } from '../../catechism/source/types/number-or-number-range.ts';

// TODO: Consider all rendering function implementations to be incomplete
//#region top-level component
export default function Content(props: { content: ContentContainer, language: Language; }): JSX.Element {
    return (
        <div class='flex justify-center'>
            <main class='
                relative bg-tan-50 text-justify h-[min-content]
                rounded-md shadow md:shadow-2xl
                w-full md:max-w-2xl lg:max-w-3xl
                px-6 xs:px-10 sm:px-20 lg:px-32
                pb-4 pt-4 sm:pt-8 md:pt-14 md:my-8 lg:pt-16
            '>
                {RenderContentBase(props.content, props.language)}
            </main>
        </div>
    );
}

function RenderContentBase(content: ContentBase, language: Language) {
    switch (content.contentType) {
        case ContentEnum.PART: {
            return PartContent(content as Part, language);
        }
        case ContentEnum.ARTICLE: {
            return ArticleContent(content as Article, language);
        }
        case ContentEnum.ARTICLE_PARAGRAPH: {
            return ArticleParagraphContent(content as ArticleParagraph, language);
        }
        case ContentEnum.BLOCK_QUOTE: {
            return BlockQuoteContent(content as BlockQuote, language);
        }
        case ContentEnum.CHAPTER: {
            return ChapterContent(content as Chapter, language);
        }
        case ContentEnum.IN_BRIEF: {
            return InBriefContent(content as InBrief, language);
        }
        case ContentEnum.PARAGRAPH: {
            return ParagraphContent(content as Paragraph, language);
        }
        case ContentEnum.PARAGRAPH_GROUP: {
            return ParagraphGroupContent(content as ParagraphGroup, language);
        }
        case ContentEnum.PARAGRAPH_SUB_ITEM: {
            return ParagraphSubitemContent(content as ParagraphSubitem, language);
        }
        case ContentEnum.PARAGRAPH_SUB_ITEM_CONTAINER: {
            return ParagraphSubitemContainerContent(content as ParagraphSubitemContainer, language);
        }
        case ContentEnum.PROLOGUE: {
            return PrologueContent(content as Prologue, language);
        }
        case ContentEnum.SECTION: {
            return SectionContent(content as Section, language);
        }
        case ContentEnum.SUB_ARTICLE: {
            return SubarticleContent(content as Subarticle, language);
        }
        case ContentEnum.TEXT_BLOCK: {
            return TextBlockContent(content as TextBlock, language);
        }
        case ContentEnum.TEXT_WRAPPER: {
            return TextWrapperContent(content as TextWrapper);
        }
        default: {
            return UnknownContent(content);
        }
    }
}
//#endregion

//#region helper components
function ArticleContent(article: Article, language: Language): JSX.Element {
    const nonFinalChildContent = [
        ...getOpeningContent(article),
        ...getMainContent(article),
    ];

    const inBrief = getInBrief(article);
    if (inBrief) {
        nonFinalChildContent.push(inBrief);
    }

    const finalContent = getFinalContent(article);
    const finalContentContainer = finalContent.length > 0
        ? <div id={translate('final-content', language)}>{ContentBaseArray(finalContent, language)}</div>
        : <></>;

    return (
        <>
            <h4 id={getUrlFragment(article.semanticPath, false, language).fragment} class='text-3xl'>
                {article.title}
            </h4>
            {ContentBaseArray(nonFinalChildContent, language)}
            {finalContentContainer}
        </>
    );
}

function ArticleParagraphContent(articleParagraph: ArticleParagraph, language: Language): JSX.Element {
    return (
        <>
            <h5 id={getUrlFragment(articleParagraph.semanticPath, false, language).fragment} class='text-2xl'>
                {articleParagraph.title}
            </h5>
            {ContentBaseArray(getAllChildContent(articleParagraph), language)}
        </>
    );
}

function BlockQuoteContent(blockQuote: BlockQuote, language: Language): JSX.Element {
    return (
        <blockquote class='px-8 mb-4'>
            {TextWrapperArray(getAllChildContent(blockQuote), language)}
        </blockquote>
    );
}

function ChapterContent(chapter: Chapter, language: Language): JSX.Element {
    return (
        <>
            <h3 id={getUrlFragment(chapter.semanticPath, false, language).fragment} class='text-4xl'>
                {chapter.title}
            </h3>
            {ContentBaseArray(getAllChildContent(chapter), language)}
        </>
    );
}

function InBriefContent(inBrief: InBrief, language: Language): JSX.Element {
    return (
        <div
            id={getUrlFragment(inBrief.semanticPath, false, language).fragment}
            class='bg-white bg-opacity-20 border border-red-900/15 border-2 rounded p-3 my-4'
        >
            <strong class='font-sans text-lg text-purple-900 block mb-1'>{translate('In Brief', language)}</strong>
            <ol>
                {getAllChildContent(inBrief).map((c) => <li key={c} class='mb-2'>{RenderContentBase(c, language)}</li>)}
            </ol>
        </div>
    );
}

function ParagraphContent(paragraph: Paragraph, language: Language): JSX.Element {
    return (
        <div id={getUrlFragment(paragraph.semanticPath, false, language).fragment}>
            <div class='text-sm align-text-bottom font-bold inline mr-1 sm:mr-2 sm:text-lg sm:align-baseline'>
                {paragraph.paragraphNumber}
            </div>
            <div class='inline'>
                {TextWrapperArray(getAllChildContent(paragraph), language)}
            </div>
        </div>
    );
}

function ParagraphGroupContent(paragraphGroup: ParagraphGroup, language: Language): JSX.Element {
    return (
        <>
            <h6 id={getUrlFragment(paragraphGroup.semanticPath, false, language).fragment} class='text-lg'>
                {paragraphGroup.title}
            </h6>
            {ContentBaseArray(getAllChildContent(paragraphGroup), language)}
        </>
    );
}

function ParagraphSubitemContainerContent(
    paragraphSubitemContainer: ParagraphSubitemContainer,
    language: Language,
): JSX.Element {
    return (
        <ol>
            {paragraphSubitemContainer.mainContent
                .map((subitem) => {
                    return <Fragment key={subitem}>{ParagraphSubitemContent(subitem, language)}</Fragment>;
                })}
        </ol>
    );
}

function ParagraphSubitemContent(paragraphSubitem: ParagraphSubitem, language: Language): JSX.Element {
    return <li>{TextWrapperArray(getAllChildContent(paragraphSubitem), language)}</li>;
}

function PartContent(part: Part, language: Language): JSX.Element {
    return (
        <>
            <h1 class='text-6xl'>{part.title}</h1>
            {ContentBaseArray(getAllChildContent(part), language)}
        </>
    );
}

function PrologueContent(prologue: Prologue, language: Language): JSX.Element {
    return (
        <>
            <h1 class='text-6xl'>{prologue.title}</h1>
            {ContentBaseArray(getAllChildContent(prologue), language)}
        </>
    );
}

function SectionContent(section: Section, language: Language): JSX.Element {
    return (
        <>
            <h2 id={getUrlFragment(section.semanticPath, false, language).fragment} class='text-5xl'>
                {section.title}
            </h2>
            {ContentBaseArray(getAllChildContent(section), language)}
        </>
    );
}

function SubarticleContent(subarticle: Subarticle, language: Language): JSX.Element {
    return (
        <>
            <h6 id={getUrlFragment(subarticle.semanticPath, false, language).fragment} class='text-xl'>
                {subarticle.title}
            </h6>
            {ContentBaseArray(getAllChildContent(subarticle), language)}
        </>
    );
}

function TextWrapperArray(array: Array<ContentBase | TextWrapper>, language: Language): Array<JSX.Element> {
    return array.map((c, index) => {
        const isTextWrapper = ContentEnum.TEXT_WRAPPER === c.contentType;
        if (isTextWrapper) {
            const precedingContentWasTextWrapper = index > 0 &&
                ContentEnum.TEXT_WRAPPER === array[index - 1].contentType;
            const spacer = precedingContentWasTextWrapper ? ' ' : '';

            return <Fragment key={c}>{spacer}{TextWrapperContent(c as TextWrapper)}</Fragment>;
        } else {
            return <Fragment key={c}>{RenderContentBase(c, language)}</Fragment>;
        }
    });
}

function TextBlockContent(textBlock: TextBlock, language: Language): JSX.Element {
    return (
        <div>
            {TextWrapperArray(getAllChildContent(textBlock), language)}
        </div>
    );
}

function TextWrapperContent(textWrapper: TextWrapper): JSX.Element {
    return (
        <span>
            <span class='absolute right-0 font-sans-caption text-xs text-left pt-1 w-6 sm:w-14 md:w-12 lg:w-20 xl:w-24'>
                {textWrapper.paragraphReferences
                    // .map((ref) => ref.toString()
                    // .map((ref) => <Fragment key={ref}>ref.toString()</Fragment>
                    .map((reference, index, allReferences) => {
                        const separator = index < allReferences.length - 1 ? ', ' : '';

                        return (
                            <Fragment key={reference}>
                                <button onClick={() => openParagraphReference(reference)}>
                                    {reference.toString()}
                                </button>
                                {separator}
                            </Fragment>
                        );
                    })}
            </span>
            <span>
                {textWrapper.mainContent
                    .map((text, index) => {
                        const lastFragment = index === textWrapper.mainContent.length - 1;
                        return <Fragment key={text}>{PlainText(text as Text, lastFragment)}</Fragment>;
                    })}
            </span>
        </span>
    );
}

function PlainText(text: Text, lastFragment: boolean): JSX.Element {
    const classes = [];
    if (text.strong) {
        classes.push('font-bold');
    }
    if (text.emphasis) {
        classes.push('italic');
    }
    if (text.smallCaps) {
        // TODO: Handle
    }

    const classText = classes.join(' ');
    const spacer = lastFragment ? '' : ' ';

    if (text.strong) {
        return (
            <strong class={classText}>
                {text.content}
                {spacer}
            </strong>
        );
    } else if (text.emphasis) {
        return (
            <em class={classText}>
                {text.content}
                {spacer}
            </em>
        );
    } else {
        return (
            <span class={classText}>
                {text.content}
                {spacer}
            </span>
        );
    }
}

function ContentBaseArray(content: Array<ContentBase>, language: Language): Array<JSX.Element> {
    return content.map((c) => <Fragment key={c}>{RenderContentBase(c, language)}</Fragment>);
}

function UnknownContent(content: ContentBase): JSX.Element {
    // TODO: Log a warning
    return <div>Unhandled content: {content.contentType}</div>;
}
//#endregion

//#region helper functions
function openParagraphReference(reference: NumberOrNumberRange): void {
    // TODO: Remove
    console.log('opening: ' + reference.toString());

    // TODO: Implement
    const paragraph = null;
}
//#endregion
