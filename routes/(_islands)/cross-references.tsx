// deno-lint-ignore-file fresh-server-event-handlers
import { JSX } from 'preact';

import ContentBase from './content-base.tsx';
import { Language, NumberOrNumberRange, Paragraph } from '../../catechism/source/types/types.ts';
import { Actions, Selectors } from '../../web/state.ts';
import { translate } from '../../web/translation.ts';

export default function CrossReferences(): JSX.Element {
    const content = Selectors.crossReference.selectedContent.value;
    const selectionHistory = Selectors.crossReference.selectionHistory.value;
    const language = Selectors.language.value;
    const showTrail = selectionHistory.length >= 2;

    if (content.length > 0) {
        return (
            <div class='absolute bottom-0 inset-x-0 max-h-[50vh] overflow-y-auto bg-white pb-8 px-4 sm:px-12 border-t border-black'>
                <div class='absolute top-4 right-4 flex gap-2 text-lg font-mono'>
                    <button onClick={() => Actions.crossReference.navigateTo()}>{translate('Open', language)}</button>
                    <div>|</div>
                    <button onClick={() => Actions.crossReference.clearSelection()}>X</button>
                </div>
                <div class='w-full md:max-w-2xl lg:max-w-3xl mx-auto mt-2'>
                    {showTrail && (
                        <div class='flex gap-2 py-2 border-b'>
                            {Trail(selectionHistory)}
                        </div>
                    )}
                    <div class={showTrail ? 'mt-2' : 'mt-4'}>
                        {Content(content, language)}
                    </div>
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
    return refs.slice(0, -1).map((ref, index, array) => {
        const final = index === array.length - 1;
        return (
            <>
                <button key={ref} onClick={() => Actions.crossReference.selectFromHistory(index)}>
                    {ref}
                    {!final && ', '}
                </button>
            </>
        );
    });
}
