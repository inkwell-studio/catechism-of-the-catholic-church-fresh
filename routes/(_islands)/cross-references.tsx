// deno-lint-ignore-file fresh-server-event-handlers
import { JSX } from 'preact';

import ContentBase from './content-base.tsx';
import { Language, NumberOrNumberRange, Paragraph } from '../../catechism/source/types/types.ts';
import { Actions, Selectors } from '../../web/state.ts';

export default function CrossReferences(): JSX.Element {
    const content = Selectors.crossReference.selectedContent.value;
    const selectionHistory = Selectors.crossReference.selectionHistory.value;
    const language = Selectors.language.value;

    const latestSelectedReference = selectionHistory.at(-1);
    if (latestSelectedReference) {
        return (
            <div class='fixed top-8 right-4 flex flex-col items-start gap-2 p-12 rounded-lg bg-white'>
                <button onClick={() => Actions.crossReference.clearSelection()} class='self-end'>Close</button>
                <div class='border-b'>
                    {Trail(selectionHistory)}
                </div>
                <div>
                    {Content(content, language)}
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}

function Content(
    paragraphs: Array<Paragraph>,
    language: Language,
): Array<JSX.Element> {
    return paragraphs.map((paragraph) => (
        <ContentBase key={paragraph} content={paragraph} language={language}></ContentBase>
    ));
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
