import { Fragment, JSX } from 'preact';

import { state } from '../state/state.ts';
import { getContent } from '../utils/content.ts';
import { getText } from '../utils/text.ts';
import {
    Article,
    ArticleParagraph,
    BlockQuote,
    Chapter,
    Content as ContentEnum,
    ContentBase,
    InBrief,
    Paragraph,
    ParagraphGroup,
    ParagraphSubitem,
    ParagraphSubitemContainer,
    Part,
    PathID,
    Prologue,
    Section,
    Subarticle,
    Text,
    TextBlock,
    TextWrapper,
} from '../catechism/source/types/types.ts';
import { getAllChildContent } from '../catechism/utils.ts';

export default function Content(props: { pathID: PathID | null }): JSX.Element {
    const pathID: PathID = props.pathID ?? state.value.path;

    const content = getContent(pathID);
    return <>{ContentBase(content)}</>;
}

// TODO: Add return type of `JSX.Element` to all appropriate functions
// TODO: Add return types to all remaining functions

// TODO: Consider all rendering function implementations to be incomplete
function ContentBase(content: ContentBase): JSX.Element {
    switch (content.contentType) {
        case ContentEnum.PART: {
            return PartContent(content as Part);
        }
        case ContentEnum.ARTICLE: {
            return ArticleContent(content as Article);
        }
        case ContentEnum.ARTICLE_PARAGRAPH: {
            return ArticleParagraphContent(content as ArticleParagraph);
        }
        case ContentEnum.BLOCK_QUOTE: {
            return BlockQuoteContent(content as BlockQuote);
        }
        case ContentEnum.CHAPTER: {
            return ChapterContent(content as Chapter);
        }
        case ContentEnum.IN_BRIEF: {
            return InBriefContent(content as InBrief);
        }
        case ContentEnum.PARAGRAPH: {
            return ParagraphContent(content as Paragraph);
        }
        case ContentEnum.PARAGRAPH_GROUP: {
            return ParagraphGroupContent(content as ParagraphGroup);
        }
        case ContentEnum.PARAGRAPH_SUB_ITEM: {
            return ParagraphSubitemContent(content as ParagraphSubitem);
        }
        case ContentEnum.PARAGRAPH_SUB_ITEM_CONTAINER: {
            return ParagraphSubitemContainerContent(content as ParagraphSubitemContainer);
        }
        case ContentEnum.PROLOGUE: {
            return PrologueContent(content as Prologue);
        }
        case ContentEnum.SECTION: {
            return SectionContent(content as Section);
        }
        case ContentEnum.SUB_ARTICLE: {
            return SubarticleContent(content as Subarticle);
        }
        case ContentEnum.TEXT_BLOCK: {
            return TextBlockContent(content as TextBlock);
        }
        case ContentEnum.TEXT_WRAPPER: {
            return TextWrapperContent(content as TextWrapper);
        }
        default: {
            return UnknownContent(content);
        }
    }
}

function ArticleContent(article: Article) {
    return (
        <>
            <h4 class='text-3xl'>{getText(article.title)}</h4>
            {ContentBaseArray(getAllChildContent(article))}
        </>
    );
}

function ArticleParagraphContent(articleParagraph: ArticleParagraph) {
    return (
        <>
            <h5 class='text-2xl'>
                {getText(articleParagraph.title)}
            </h5>
            {ContentBaseArray(getAllChildContent(articleParagraph))}
        </>
    );
}

function BlockQuoteContent(blockQuote: BlockQuote) {
    return (
        <blockquote class='px-8 mb-4'>
            {TextWrapperArray(getAllChildContent(blockQuote))}
        </blockquote>
    );
}

function ChapterContent(chapter: Chapter) {
    return (
        <>
            <h3 class='text-4xl'>{getText(chapter.title)}</h3>
            {ContentBaseArray(getAllChildContent(chapter))}
        </>
    );
}

function InBriefContent(inBrief: InBrief) {
    return (
        <div class='bg-white bg-opacity-20 border border-red-900/15 border-2 rounded p-3 my-4'>
            <strong class='font-sans text-lg text-purple-900 block mb-1'>In Brief</strong>
            <ol>
                {getAllChildContent(inBrief).map((c) => <li key={c} class='mb-2'>{ContentBase(c)}</li>)}
            </ol>
        </div>
    );
}

function ParagraphContent(paragraph: Paragraph) {
    return (
        <div class=''>
            <div class='text-sm align-text-bottom font-bold inline mr-1 sm:mr-2 sm:text-lg sm:align-baseline'>
                {paragraph.paragraphNumber}
            </div>
            <div class='inline'>
                {TextWrapperArray(getAllChildContent(paragraph))}
            </div>
        </div>
    );
}

function ParagraphGroupContent(paragraphGroup: ParagraphGroup) {
    return (
        <>
            <h6 class='text-lg'>{getText(paragraphGroup.title)}</h6>
            {ContentBaseArray(getAllChildContent(paragraphGroup))}
        </>
    );
}

function ParagraphSubitemContainerContent(paragraphSubitemContainer: ParagraphSubitemContainer) {
    return (
        <ol>
            {paragraphSubitemContainer.mainContent
                .map((subitem) => {
                    return <Fragment key={subitem}>{ParagraphSubitemContent(subitem)}</Fragment>;
                })}
        </ol>
    );
}

function PrologueContent(prologue: Prologue) {
    return (
        <>
            <h1 class='text-6xl'>{getText(prologue.title)}</h1>
            {ContentBaseArray(getAllChildContent(prologue))}
        </>
    );
}

function ParagraphSubitemContent(paragraphSubitem: ParagraphSubitem) {
    return <li>{TextWrapperArray(getAllChildContent(paragraphSubitem))}</li>;
}

function PartContent(part: Part) {
    return (
        <>
            <h1 class='text-6xl'>{getText(part.title)}</h1>
            {ContentBaseArray(getAllChildContent(part))}
        </>
    );
}

function SectionContent(section: Section) {
    return (
        <>
            <h2 class='text-5xl'>{getText(section.title)}</h2>
            {ContentBaseArray(getAllChildContent(section))}
        </>
    );
}

function SubarticleContent(subarticle: Subarticle) {
    return (
        <>
            <h6 class='text-xl'>{getText(subarticle.title)}</h6>
            {ContentBaseArray(getAllChildContent(subarticle))}
        </>
    );
}

function TextWrapperArray(array: Array<ContentBase | TextWrapper>) {
    return array.map((c, index) => {
        const isTextWrapper = ContentEnum.TEXT_WRAPPER === c.contentType;
        if (isTextWrapper) {
            const precedingContentWasTextWrapper = index > 0 &&
                ContentEnum.TEXT_WRAPPER === array[index - 1].contentType;
            const spacer = precedingContentWasTextWrapper ? ' ' : '';

            return <Fragment key={c}>{spacer}{TextWrapperContent(c as TextWrapper)}</Fragment>;
        } else {
            return <Fragment key={c}>{ContentBase(c)}</Fragment>;
        }
    });
}

function TextBlockContent(textBlock: TextBlock) {
    return (
        <div>
            {TextWrapperArray(getAllChildContent(textBlock))}
        </div>
    );
}

function TextWrapperContent(textWrapper: TextWrapper) {
    return (
        <span>
            <span class='absolute right-0 font-sans-caption text-xs text-left pt-1 w-6 sm:w-14 md:w-12 lg:w-20 xl:w-24'>
                {textWrapper.paragraphReferences.map((ref) => ref.toString()).join(', ')}
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

function PlainText(text: Text, lastFragment: boolean) {
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
                {getText(text.content)}
                {spacer}
            </strong>
        );
    } else if (text.emphasis) {
        return (
            <em class={classText}>
                {getText(text.content)}
                {spacer}
            </em>
        );
    } else {
        return (
            <span class={classText}>
                {getText(text.content)}
                {spacer}
            </span>
        );
    }
}

function ContentBaseArray(content: Array<ContentBase>) {
    return content.map((c) => <Fragment key={c}>{ContentBase(c)}</Fragment>);
}

function UnknownContent(content: ContentBase) {
    // TODO: Log a warning
    return <div>Unhandled content: {content.contentType}</div>;
}
