// deno-lint-ignore-file fresh-server-event-handlers
import { Fragment, JSX } from 'preact';

import ContentBase from './content-base.tsx';
import { Language, NumberOrNumberRange, Paragraph } from '../../catechism/source/types/types.ts';
import { getParagraphNumbers } from '../../catechism/source/utils/content.ts';
import { clearCrossReferenceSelection, state } from '../../web/state.ts';

export default function CrossReferences(props: { paragraphs: Array<Paragraph>; language: Language }): JSX.Element {
    const refs = state.value.selectedCrossReferences;
    const latestSelectedReference = refs.at(-1);

    if (latestSelectedReference) {
        return (
            <div className='flex flex-col gap-2'>
                <div>
                    {Trail(refs.slice(0, 1))}
                </div>
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
                {crossReferences.map((ref) => <Fragment key={ref}>{ContentBase(ref, language)}</Fragment>)}
            </div>
        </div>
    );
}

function Trail(references: Array<NumberOrNumberRange>): Array<JSX.Element> {
    return references.map((ref, index) => {
        const finalReference = index === references.length - 1;
        return (
            <>
                <span key={ref}>ref{finalReference ? ', ' : ''}</span>
                {finalReference ? <>' '</> : <></>};
            </>
        );
    });
}
