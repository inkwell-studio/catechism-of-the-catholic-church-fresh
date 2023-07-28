import { Fragment, JSX } from 'preact';

import tableOfContents from '../catechism/artifacts/table-of-contents.json' assert { type: 'json' };
import { Content, TableOfContentsEntry, TableOfContentsType } from '../catechism/source/types/types.ts';

export function TableOfContents() {
    const toc = tableOfContents as TableOfContentsType;

    return (
        <nav class='mx-auto py-12'>
            <ol className='space-y-6'>
                <li>
                    {TopLevelEntry(toc.prologue)}
                </li>

                {toc.parts.map((part) => (
                    <li key={part}>
                        {TopLevelEntry(part)}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

function TopLevelEntry(entry: TableOfContentsEntry): JSX.Element {
    return (
        <div>
            <span class='text-3xl'>{entry.title}</span>
            {ParagraphNumbers(entry, null, 'opacity-40 text-xl ml-3')}
            <ol class='border rounded bg-white/30 py-4 px-10 mt-2'>
                {entry.children.map((child) => (
                    <li>
                        {ChildEntry(child, entry, 0)}
                    </li>
                ))}
            </ol>
        </div>
    );
}

function ChildEntry(
    entry: TableOfContentsEntry,
    parent: TableOfContentsEntry,
    indentationLevel: number,
): JSX.Element {
    const classes = entry.children.length === 0 ? 'list-disc list-inside marker:text-black/30' : '';

    return (
        <li class={classes}>
            <a href={'/read/' + entry.semanticPath} class={titleClasses(entry.contentType)}>{entry.title}</a>
            {ParagraphNumbers(entry, parent, 'opacity-40 text-xs ml-2')}
            {Children(entry.children, entry, indentationLevel + 1)}
        </li>
    );
}

function ParagraphNumbers(
    entry: TableOfContentsEntry,
    parentEntry: TableOfContentsEntry | null,
    classes: string,
): JSX.Element {
    return shouldRenderParagraphNumbers(entry, parentEntry)
        ? <span class={classes}>{entry.firstParagraphNumber + '–' + entry.lastParagraphNumber}</span>
        : <></>;
}

function titleClasses(contentType: Content): string {
    const common = ' font-sans ';

    switch (contentType) {
        case Content.SECTION: {
            return common + 'text-2xl font-bold';
        }
        case Content.CHAPTER: {
            return common + 'text-lg font-semibold';
        }
        case Content.ARTICLE: {
            return common + 'font-bold uppercase';
        }
        case Content.ARTICLE_PARAGRAPH: {
            return common + 'text-sm font-bold';
        }
        case Content.SUB_ARTICLE: {
            return common + '';
        }
        case Content.PARAGRAPH_GROUP: {
            return common + '';
        }
        case Content.TEXT: {
            return common + '';
        }
        case Content.TEXT_HEADING: {
            return common + '';
        }
        default: {
            return common + '';
        }
    }
}

function Children(
    children: Array<TableOfContentsEntry>,
    parent: TableOfContentsEntry,
    indentationLevel: number,
): JSX.Element {
    if (children.length === 0) {
        return <></>;
    } else {
        return (
            <ol>
                {children.map((child) => (
                    <Fragment key={child}>{ChildEntry(child, parent, indentationLevel)}</Fragment>
                ))}
            </ol>
        );
    }
}

/**
 * @returns `true` if the children of `parentEntry` should have their paragraph numbers rendered
 */
function shouldRenderParagraphNumbers(
    entry: TableOfContentsEntry,
    parentEntry: TableOfContentsEntry | null = null,
): boolean {
    return null === parentEntry ||
        Content.PROLOGUE === parentEntry.contentType ||
        Content.PART === parentEntry.contentType ||
        Content.SECTION === parentEntry.contentType ||
        Content.CHAPTER === parentEntry.contentType ||
        Content.ARTICLE_PARAGRAPH === entry.contentType ||
        Content.SUB_ARTICLE === entry.contentType ||
        Content.IN_BRIEF === entry.contentType;
}
