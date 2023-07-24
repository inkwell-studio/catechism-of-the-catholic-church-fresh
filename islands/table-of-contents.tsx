import { Fragment } from 'preact';

import tableOfContents from '../catechism/artifacts/table-of-contents.json' assert { type: 'json' };

import { TableOfContentsEntry, TableOfContentsType } from '../catechism/source/types/types.ts';

export default function TableOfContents() {
    const toc = tableOfContents as TableOfContentsType;

    return (
        <div class='flex flex-col justify-center items-center'>
            <h2>Index</h2>
            <h2>Glossary</h2>
            <h2>Main Content</h2>

            {EntryElement(toc.prologue)}

            {toc.parts.map((part) => (
                <Fragment key={part}>
                    {EntryElement(part)}
                </Fragment>
            ))}
        </div>
    );
}

function EntryElement(entry: TableOfContentsEntry) {
    return (
        <div>
            <a href={'/read/' + entry.semanticPath}>{entry.title}</a> ({entry.firstParagraphNumber})
            {Children(entry.children)}
        </div>
    );
}

function Children(children: Array<TableOfContentsEntry>) {
    if (children.length === 0) {
        return <></>;
    } else {
        return (
            <ol>
                {children.map((child) => <li key={child}>{EntryElement(child)}</li>)}
            </ol>
        );
    }
}
