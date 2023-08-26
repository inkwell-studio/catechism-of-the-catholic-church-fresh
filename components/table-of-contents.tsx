import { Fragment, JSX } from 'preact';

import tableOfContents from '../catechism/artifacts/table-of-contents.json' assert { type: 'json' };
import { Content, SemanticPath, TableOfContentsEntry, TableOfContentsType } from '../catechism/source/types/types.ts';

export function TableOfContents() {
    const toc = tableOfContents as TableOfContentsType;

    return (
        <>
            <h1 class='font-serif font-bold text-5xl text-center mt-16'>
                <span class='inline-block'>Catechism of&nbsp;the</span>
                <br />
                <span class='inline-block mt-1 md:mt-2 lg:mt-3'>Catholic Church</span>
            </h1>
            <div className='flex flex-col gap-12 my-12'>
                <h2 class='text-3xl text-center'>
                    Table of Contents
                </h2>
                <div class='w-48 mx-auto border border-red-900/50 rounded'></div>
                <nav class='mx-auto'>
                    <ol className='space-y-6'>
                        <li>
                            {EntryContainer(toc.prologue)}
                        </li>

                        {toc.parts.map((part) => (
                            <li key={part}>
                                {EntryContainer(part)}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </>
    );
}

function EntryContainer(entry: TableOfContentsEntry): JSX.Element {
    return (
        <div>
            <a href={entry.url} class='inline-block'>
                <h3 class='text-3xl'>{entry.title}</h3>
            </a>
            {ParagraphNumbers(entry, null, 'opacity-40 font-sans text-xl ml-2')}
            <ol class='border rounded bg-tan-50 py-4 px-10 mt-2'>
                {entry.children.map((child) => ChildEntry(child, entry, 0))}
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
        <li class={classes + ' ml-4'}>
            <a href={entry.url} class={titleClasses(entry.contentType)}>{entry.title}</a>
            {ParagraphNumbers(entry, parent, 'opacity-40 font-sans text-xs ml-1')}
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
        entry.semanticPath.includes('final-content') ||
        Content.PROLOGUE === parentEntry.contentType ||
        Content.PART === parentEntry.contentType ||
        Content.SECTION === parentEntry.contentType ||
        Content.CHAPTER === parentEntry.contentType ||
        Content.ARTICLE_PARAGRAPH === entry.contentType ||
        Content.SUB_ARTICLE === entry.contentType ||
        Content.IN_BRIEF === entry.contentType;
}
