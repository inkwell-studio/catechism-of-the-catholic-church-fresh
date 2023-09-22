// deno-lint-ignore-file fresh-server-event-handlers
import { Fragment, JSX } from 'preact';

import { clearCrossReferenceSelection, selectCrossReference, state } from '../../web/state.ts';
import {
    BlockQuote,
    Content as ContentEnum,
    ContentBase,
    Language,
    NumberOrNumberRange,
    Paragraph,
    ParagraphGroup,
    ParagraphSubitem,
    ParagraphSubitemContainer,
    Text,
    TextBlock,
    TextHeading,
    TextWrapper,
} from '../../catechism/source/types/types.ts';
import { getAllChildContent, getParagraphNumbers } from '../../catechism/source/utils/content.ts';

//#region top-level components
export default function CrossReferences(props: { paragraphs: Array<Paragraph>; language: Language }): JSX.Element {
    const refs = state.value.selectedCrossReferences;
    const latestSelectedReference = refs.at(-1);

    if (latestSelectedReference) {
        return (
            <div className='flex flex-col gap-2'>
                {Trail(refs.slice(0, 1))}
                {Content(latestSelectedReference, props.paragraphs, props.language)}
            </div>
        );
    } else {
        return <></>;
    }
}

function Content(
    selectedReference: NumberOrNumberRange,
    paragraphs: Array<Paragraph>,
    language: Language,
): JSX.Element {
    const paragraphNumbers = getParagraphNumbers([selectedReference]);
    const crossReferences = paragraphs.filter((p) => paragraphNumbers.includes(p.paragraphNumber));

    return (
        <div class='fixed top-8 right-4 p-12 rounded-lg bg-white'>
            <div class='space-y-4'>
                <div>{selectedReference}</div>
                <button onClick={clearCrossReferenceSelection}>Close</button>
            </div>
            <div className='border border-black border-2'>
                {ContentBaseArray(crossReferences, language)}
            </div>
        </div>
    );
}

function Trail(references: Array<NumberOrNumberRange>): JSX.Element {
    // TODO: Implement
    return <div>Trail</div>;
}
//#endregion

//#region helper components
function ContentBaseArray(content: Array<ContentBase>, language: Language): Array<JSX.Element> {
    return content.map((c) => <Fragment key={c}>{RenderContentBase(c, language)}</Fragment>);
}

function RenderContentBase(content: ContentBase, language: Language) {
    switch (content.contentType) {
        case ContentEnum.BLOCK_QUOTE: {
            return BlockQuoteContent(content as BlockQuote, language);
        }
        case ContentEnum.PARAGRAPH: {
            return ParagraphContent(content as Paragraph, language);
        }
        case ContentEnum.PARAGRAPH_SUB_ITEM: {
            return ParagraphSubitemContent(content as ParagraphSubitem, language);
        }
        case ContentEnum.PARAGRAPH_SUB_ITEM_CONTAINER: {
            return ParagraphSubitemContainerContent(content as ParagraphSubitemContainer, language);
        }
        case ContentEnum.TEXT_BLOCK: {
            return TextBlockContent(content as TextBlock, language);
        }
        case ContentEnum.TEXT_HEADING: {
            return TextHeadingContent(content as TextHeading);
        }
        case ContentEnum.TEXT_WRAPPER: {
            return TextWrapperContent(content as TextWrapper);
        }
        default: {
            return UnknownContent(content);
        }
    }
}

function BlockQuoteContent(blockQuote: BlockQuote, language: Language): JSX.Element {
    return (
        <blockquote class='px-8 mb-4'>
            {TextWrapperArray(getAllChildContent(blockQuote), language)}
        </blockquote>
    );
}

function ParagraphContent(paragraph: Paragraph, language: Language): JSX.Element {
    return (
        <div>
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
            <h6 class='text-lg'>
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

function TextWrapperContent(textWrapper: TextWrapper): JSX.Element {
    return (
        <span>
            <span class='absolute right-0 font-sans-caption text-xs text-left pt-1 w-6 sm:w-14 md:w-12 lg:w-20 xl:w-24'>
                {textWrapper.paragraphReferences
                    // TODO: Determine if anything should be done with these two lines (were they meant to be a more readable implementation?)
                    // .map((ref) => ref.toString()
                    // .map((ref) => <Fragment key={ref}>ref.toString()</Fragment>
                    .map((reference, index, allReferences) => {
                        const separator = index < allReferences.length - 1 ? ', ' : '';

                        return (
                            <Fragment key={reference}>
                                <button onClick={() => selectCrossReference(reference)}>
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

function UnknownContent(content: ContentBase): JSX.Element {
    // TODO: Log a warning
    return <div>Unhandled content: {content.contentType}</div>;
}
//#endregion
