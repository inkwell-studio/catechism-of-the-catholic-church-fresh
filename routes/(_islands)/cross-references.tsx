// deno-lint-ignore-file fresh-server-event-handlers
import { Fragment, JSX } from 'preact';

import ContentBase from './content-base.tsx';
import { Language, NumberOrNumberRange, Paragraph } from '../../catechism/source/types/types.ts';
import { getParagraphNumbers } from '../../catechism/source/utils/content.ts';
import { clearCrossReferenceSelection, state } from '../../web/state.ts';
import { loadParagraphs } from '../../web/rendering.ts';

// TODO: Load data

export default function CrossReferences(
    props: { cachedParagraphs: Array<Paragraph>; language: Language },
): JSX.Element {
    const refs = state.value.selectedCrossReferences;
    const latestSelectedReference = refs.at(-1);

    if (latestSelectedReference) {
        return (
            <div className='fixed top-8 right-4 flex flex-col items-start gap-2 p-12 rounded-lg bg-white'>
                <button onClick={clearCrossReferenceSelection} class='self-end'>Close</button>
                <div class='border-b'>
                    {Trail(state.value.selectedCrossReferences)}
                </div>
                <div>
                    {Content(latestSelectedReference, props.cachedParagraphs, props.language)}
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}

function Content(
    selectedReference: NumberOrNumberRange,
    cachedParagraphs: Array<Paragraph>,
    language: Language,
): Array<JSX.Element> {
    const paragraphNumbers = getParagraphNumbers([selectedReference]);

    const cachedParagraphNumbers = cachedParagraphs.map((p) => p.paragraphNumber);
    const missingParagraphNumbers = paragraphNumbers.filter((num) => !cachedParagraphNumbers.includes(num));

    const loadedParagraphs: Array<Paragraph> = missingParagraphNumbers.length > 0
        // TODO: Handle asynchronity
        ? loadParagraphs(language, missingParagraphNumbers)
        : [];

    const crossReferences = [...cachedParagraphs, ...loadedParagraphs].filter((p) =>
        paragraphNumbers.includes(p.paragraphNumber)
    );

    return crossReferences.map((ref) => <ContentBase key={ref} content={ref} language={language}></ContentBase>);
}

function Trail(refs: Array<NumberOrNumberRange>): Array<JSX.Element> {
    return refs.map((ref, index) => {
        const finalReference = index === refs.length - 1;
        // TODO: Implement proper `onClick` functionality
        return (
            <>
                <button key={ref}>{ref}{finalReference ? '' : ','}</button>
                {finalReference ? <></> : ' '}
            </>
        );
    });
}
