import { computed, signal } from '@preact/signals';

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
    language: Language;
    showChangelog: boolean;
    crossReference: {
        selectedContent: Array<Paragraph>;
        // A stack of the cross-references selected by the user. The most recent selection is at the end of the array.
        selectionHistory: Array<NumberOrNumberRange>;
    };
};

const state = signal<State>({
    language: Language.ENGLISH,
    showChangelog: false,
    crossReference: {
        selectedContent: [],
        selectionHistory: [],
    },
});

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
    state.value = {
        ...state.value,
        showChangelog: true,
    };
}

function closeChangelog(): void {
    state.value = {
        ...state.value,
        showChangelog: false,
    };
}
//#endregion

//#region language
function updateLanguage(language: Language): void {
    state.value = { ...state.value, language };
}
//#endregion

//#region cross-references
async function selectCrossReference(reference: NumberOrNumberRange): Promise<void> {
    if (state.value.crossReference.selectionHistory.at(-1) !== reference) {
        const selectionHistory = state.value.crossReference.selectionHistory.concat(reference);
        if (selectionHistory.length > CROSS_REFERENCE_HISTORY_LIMIT) {
            selectionHistory.shift();
        }
        const s = updateCrossReferenceSelectionHistory(state.value, selectionHistory);
        state.value = await loadCrossReferenceSelectedContent(s, reference);
    }
}

async function selectCrossReferenceFromHistory(index: number): Promise<void> {
    const selectionHistory = state.value.crossReference.selectionHistory.slice(0, index + 1);
    const s = updateCrossReferenceSelectionHistory(state.value, selectionHistory);
    state.value = await loadCrossReferenceSelectedContent(s, selectionHistory.at(-1) as NumberOrNumberRange);
}

async function loadCrossReferenceSelectedContent(s: State, paragraphNumbers: NumberOrNumberRange): Promise<State> {
    const paragraphs = await server.getParagraphs(paragraphNumbers, s.language);
    return updateCrossReferenceSelectedContent(s, paragraphs);
}

function clearCrossReferenceSelection(): void {
    const s = updateCrossReferenceSelectionHistory(state.value, []);
    state.value = updateCrossReferenceSelectedContent(s, []);
}

function updateCrossReferenceSelectedContent(s: State, selectedContent: Array<Paragraph>): State {
    return {
        ...s,
        crossReference: {
            ...s.crossReference,
            selectedContent,
        },
    };
}

function updateCrossReferenceSelectionHistory(s: State, selectionHistory: Array<NumberOrNumberRange>): State {
    return {
        ...s,
        crossReference: {
            ...s.crossReference,
            selectionHistory,
        },
    };
}
//#endregion
//#endregion

//#region Selectors
// Selectors are named as: [noun].[verb]
export const Selectors = {
    language: computed(() => state.value.language),
    changelog: {
        show: computed(() => state.value.showChangelog),
    },
    crossReference: {
        selectedContent: computed(() => state.value.crossReference.selectedContent),
        selectionHistory: computed(() => state.value.crossReference.selectionHistory),
    },
} as const;
//#endregion
