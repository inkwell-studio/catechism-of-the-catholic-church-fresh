import { batch, computed, Signal, signal } from '@preact/signals';

import * as server from './server.ts';
import { Language, NumberOrNumberRange, Paragraph } from '../catechism/source/types/types.ts';

/*
    The state is contained in the `state` constant below.
    This constant is not exposed to any part of the app. Instead,
    values are subscribed to through the `Selectors` constant, and
    the state management logic is notified of the need for updating through the `Actions` constant.
*/

//#region state
type State = {
    language: Signal<Language>;
    showChangelog: Signal<boolean>;
    crossReference: {
        selectedContent: Signal<Array<Paragraph>>;
        // A stack of the cross-references selected by the user. The most recent selection is at the end of the array.
        selectionHistory: Signal<Array<NumberOrNumberRange>>;
    };
};

const state: State = {
    language: signal(Language.ENGLISH),
    showChangelog: signal(false),
    crossReference: {
        selectedContent: signal([]),
        selectionHistory: signal([]),
    },
};

const CROSS_REFERENCE_HISTORY_LIMIT = 7;
//#endregion

//#region Actions
// Actions are named as: [noun].[verb]
export const Actions = {
    changelog: {
        open: openChangelog,
        close: closeChangelog,
    },
    language: {
        update: updateLanguage,
    },
    crossReference: {
        select: selectCrossReference,
        selectFromHistory: selectCrossReferenceFromHistory,
        clearSelection: clearCrossReferenceSelection,
    },
} as const;

//#region changelog
function openChangelog(): void {
    state.showChangelog.value = true;
}

function closeChangelog(): void {
    state.showChangelog.value = false;
}
//#endregion

//#region language
function updateLanguage(language: Language): void {
    state.language.value = language;
}
//#endregion

//#region cross-references
function selectCrossReference(reference: NumberOrNumberRange): void {
    if (state.crossReference.selectionHistory.value.at(-1) !== reference) {
        const selectionHistory = state.crossReference.selectionHistory.value.concat(reference);
        if (selectionHistory.length > CROSS_REFERENCE_HISTORY_LIMIT) {
            selectionHistory.shift();
        }
        batch(() => {
            updateCrossReferenceSelectionHistory(selectionHistory);
            loadCrossReferenceSelectedContent(reference);
        });
    }
}

function selectCrossReferenceFromHistory(index: number): void {
    const selectionHistory = state.crossReference.selectionHistory.value.slice(0, index + 1);
    batch(() => {
        updateCrossReferenceSelectionHistory(selectionHistory);
        loadCrossReferenceSelectedContent(selectionHistory.at(-1) as NumberOrNumberRange);
    });
}

async function loadCrossReferenceSelectedContent(paragraphNumbers: NumberOrNumberRange): Promise<void> {
    const paragraphs = await server.getParagraphs(paragraphNumbers, state.language.value);
    updateCrossReferenceSelectedContent(paragraphs);
}

function clearCrossReferenceSelection(): void {
    batch(() => {
        updateCrossReferenceSelectionHistory([]);
        updateCrossReferenceSelectedContent([]);
    });
}

function updateCrossReferenceSelectedContent(selectedContent: Array<Paragraph>): void {
    state.crossReference.selectedContent.value = selectedContent;
}

function updateCrossReferenceSelectionHistory(selectionHistory: Array<NumberOrNumberRange>): void {
    state.crossReference.selectionHistory.value = selectionHistory;
}
//#endregion
//#endregion

//#region Selectors
// Selectors are named as: [noun].[verb]
export const Selectors = {
    language: computed(() => state.language.value),
    changelog: {
        show: computed(() => state.showChangelog.value),
    },
    crossReference: {
        selectedContent: computed(() => state.crossReference.selectedContent.value),
        selectionHistory: computed(() => state.crossReference.selectionHistory.value),
    },
} as const;
//#endregion
