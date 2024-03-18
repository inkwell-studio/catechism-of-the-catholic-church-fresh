import { Fragment, JSX } from 'preact';
import { useSignal } from '@preact/signals';

import {
    Article,
    ArticleParagraph,
    BibleReference,
    BlockQuote,
    Chapter,
    Content as ContentEnum,
    ContentBase as ContentBaseType,
    InBrief,
    Language,
    OtherReference,
    Paragraph,
    ParagraphGroup,
    ParagraphSubitem,
    ParagraphSubitemContainer,
    Part,
    Prologue,
    ReferenceBase,
    ReferenceCollection,
    ReferenceEnum,
    Section,
    Subarticle,
    Text,
    TextBlock,
    TextHeading,
    TextWrapper,
} from '../../../catechism/source/types/types.ts';
import {
    getAllChildContent,
    getFinalContent,
    getInBrief,
    getMainContent,
    getOpeningContent,
} from '../../../catechism/source/utils/content.ts';
import { getBibleReferenceUrl, getOtherReferenceUrl } from '../../logic/client/reference.ts';
import { getUrlFragment } from '../../logic/shared/routing.ts';
import { Actions } from '../../logic/shared/state.ts';
import { translate } from '../../logic/shared/translation.ts';

// TODO: Consider all rendering function implementations to be incomplete

//#region top-level component
export default function ContentBase(props: { content: ContentBaseType; language: Language }): JSX.Element {
    const content = props.content;
    const language = props.language;

    switch (content.contentType) {
        case ContentEnum.PART:
            return PartContent(content as Part, language);
        case ContentEnum.ARTICLE:
            return ArticleContent(content as Article, language);
        case ContentEnum.ARTICLE_PARAGRAPH:
            return ArticleParagraphContent(content as ArticleParagraph, language);
        case ContentEnum.BLOCK_QUOTE:
            return BlockQuoteContent(content as BlockQuote, language);
        case ContentEnum.CHAPTER:
            return ChapterContent(content as Chapter, language);
        case ContentEnum.IN_BRIEF:
            return InBriefContent(content as InBrief, language);
        case ContentEnum.PARAGRAPH:
            return ParagraphContent(content as Paragraph, language);
        case ContentEnum.PARAGRAPH_GROUP:
            return ParagraphGroupContent(content as ParagraphGroup, language);
        case ContentEnum.PARAGRAPH_SUB_ITEM:
            return ParagraphSubitemContent(content as ParagraphSubitem, language);
        case ContentEnum.PARAGRAPH_SUB_ITEM_CONTAINER:
            return ParagraphSubitemContainerContent(content as ParagraphSubitemContainer, language);
        case ContentEnum.PROLOGUE:
            return PrologueContent(content as Prologue, language);
        case ContentEnum.SECTION:
            return SectionContent(content as Section, language);
        case ContentEnum.SUB_ARTICLE:
            return SubarticleContent(content as Subarticle, language);
        case ContentEnum.TEXT_BLOCK:
            return TextBlockContent(content as TextBlock, language);
        case ContentEnum.TEXT_HEADING:
            return TextHeadingContent(content as TextHeading);
        case ContentEnum.TEXT_WRAPPER:
            return TextWrapperContent(content as TextWrapper, language);
        default:
            return UnknownContent(content);
    }
}
//#endregion

//#region helper components
function ContentBaseArray(content: Array<ContentBaseType>, language: Language): Array<JSX.Element> {
    return content.map((c) => <ContentBase key={c} content={c} language={language}></ContentBase>);
}

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
                {getAllChildContent(inBrief).map((c) => (
                    <li key={c} class='mb-2'>
                        <ContentBase content={c} language={language}></ContentBase>
                    </li>
                ))}
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

function TextBlockContent(textBlock: TextBlock, language: Language): JSX.Element {
    return (
        <div>
            {TextWrapperArray(getAllChildContent(textBlock), language)}
        </div>
    );
}

function TextHeadingContent(textHeading: TextHeading): JSX.Element {
    return <>textHeading.content</>;
}

function TextWrapperArray(array: Array<ContentBaseType | TextWrapper>, language: Language): Array<JSX.Element> {
    return array.map((c, index) => {
        const isTextWrapper = ContentEnum.TEXT_WRAPPER === c.contentType;
        if (isTextWrapper) {
            const precedingContentWasTextWrapper = index > 0 &&
                ContentEnum.TEXT_WRAPPER === array[index - 1].contentType;
            const spacer = precedingContentWasTextWrapper ? ' ' : '';

            return <Fragment key={c}>{spacer}{TextWrapperContent(c as TextWrapper, language)}</Fragment>;
        } else {
            return <ContentBase key={c} content={c} language={language}></ContentBase>;
        }
    });
}

function TextWrapperContent(textWrapper: TextWrapper, language: Language): JSX.Element {
    const textContent = textWrapper.mainContent
        .map((text, index) => {
            const lastFragment = index === textWrapper.mainContent.length - 1;
            return (
                <Fragment key={text}>
                    {PlainText(text as Text, lastFragment)}
                </Fragment>
            );
        });

    return (
        <span>
            <span class='absolute right-0 font-sans-caption text-xs text-left pt-1 w-6 sm:w-14 md:w-12 lg:w-20 xl:w-24'>
                {textWrapper.paragraphReferences
                    .map((reference, index, allReferences) => {
                        const separator = index < allReferences.length - 1 ? ', ' : '';

                        return (
                            <Fragment key={reference}>
                                <button onClick={() => Actions.crossReference.select(reference)}>
                                    {reference.toString()}
                                </button>
                                {separator}
                            </Fragment>
                        );
                    })}
            </span>
            <span>
                {textContent}
                {ReferenceCollectionContent(textWrapper.referenceCollection, language)}
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
            <>
                <strong class={classText}>
                    {text.content}
                </strong>
                {spacer}
            </>
        );
    } else if (text.emphasis) {
        return (
            <>
                <em class={classText}>
                    {text.content}
                </em>
                {spacer}
            </>
        );
    } else if (classText) {
        return (
            <>
                <span class={classText}>
                    {text.content}
                </span>
                {spacer}
            </>
        );
    } else {
        return (
            <>
                <span>
                    {text.content}
                </span>
                {spacer}
            </>
        );
    }
}

function ReferenceCollectionContent(referenceCollection: ReferenceCollection | null, language: Language): JSX.Element {
    if (!referenceCollection || referenceCollection.references.length === 0) {
        return <></>;
    }

    const isOpen = useSignal(false);

    const superscript = (
        <button onClick={() => isOpen.value = !isOpen.value} class='px-0.5'>
            <sup>{referenceCollection.referenceNumber}</sup>
        </button>
    );

    const fullDisplay = isOpen.value
        ? (
            <div class='absolute z-10 bottom-6 -left-8 w-max text-sm font-sans p-2 bg-white border'>
                {referenceCollection.references.map((ref, i, refs) => {
                    const divider = i > 0 && i < refs.length ? '; ' : '';

                    return <>{divider}{ReferenceContent(ref, language)}</>;
                })}
                <button onClick={() => isOpen.value = false} class='font-mono ml-2'>
                    <sup>X</sup>
                </button>
            </div>
        )
        : <></>;

    return (
        <span class='relative'>
            {superscript}
            {fullDisplay}
        </span>
    );
}

function ReferenceContent(reference: ReferenceBase, language: Language): JSX.Element {
    if (ReferenceEnum.BIBLE === reference.referenceType) {
        return BibleReferenceContent(reference as BibleReference, language);
    } else if (ReferenceEnum.OTHER === reference.referenceType) {
        return OtherReferenceContent(reference as OtherReference, language);
    } else {
        console.warn(`Unknown reference type encountered: ${reference.referenceType}`);
        return <></>;
    }
}

function BibleReferenceContent(reference: BibleReference, language: Language): JSX.Element {
    const prefix = reference.direct ? '' : translate('Cf. ', language);
    const postfix = reference.auxillaryText ? ` (${translate(reference.auxillaryText, language)})` : '';
    const book = translate(reference.book, language);

    return (
        <a href={getBibleReferenceUrl(reference, language)} target='_blank'>
            {`${prefix}${book} ${reference.chapter}:${reference.verses}${postfix}`}
        </a>
    );
}

function OtherReferenceContent(reference: OtherReference, language: Language): JSX.Element {
    const prefix = reference.direct ? '' : translate('Cf. ', language);
    const source = reference.source;
    const pointer = reference.pointer ? `: ${reference.pointer}` : '';

    return <a href={getOtherReferenceUrl(reference, language)} target='_blank'>{`${prefix}${source}${pointer}`}</a>;
}

function UnknownContent(content: ContentBaseType): JSX.Element {
    console.warn(`Unknown content type encountered: ${content.contentType}`);
    return <div>Unhandled content: {content.contentType}</div>;
}
//#endregion
