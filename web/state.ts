import { computed, signal } from '@preact/signals';
import { Language, NumberOrNumberRange, Paragraph } from '../catechism/source/types/types.ts';
import { getParagraphCrossReferenceContentMap } from '../catechism/source/utils/artifacts.ts';

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
        clearSelection: clearCrossReferenceSelection,
    },
} as const;

//#region state-modifying functions
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
    // TODO: Enforce a limit on the maximum number of selections (once exceeded, remove the oldest reference and add the new one)
    if (state.value.crossReference.selectionHistory.at(-1) !== reference) {
        const selectionHistory = state.value.crossReference.selectionHistory.concat(reference);
        const s = updateCrossReferenceSelections(state.value, selectionHistory);
        state.value = await loadCrossReferenceSelectedContent(s, reference);
    }
}

async function loadCrossReferenceSelectedContent(s: State, selection: NumberOrNumberRange): Promise<State> {
    // TODO: Implement
}

function clearCrossReferenceSelection(s: State): State {
    return updateCrossReferenceSelections(s, []);
}

function updateCrossReferenceSelections(s: State, selectionHistory: Array<NumberOrNumberRange>): State {
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
//#endregion

//#region Selectors
// Selectors are named as: [noun].[verb]
export const Selectors = {
    language: computed(() => state.value.language),
    changelog: {
        show: computed(() => state.value.showChangelog),
    },
    crossReference: {
        selectionHistory: computed(() => state.value.crossReference.selectionHistory),
    },
} as const;
//#endregion
