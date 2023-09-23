import { computed, signal } from '@preact/signals';
import { Language, NumberOrNumberRange } from '../catechism/source/types/types.ts';

/*
    The state is contained in the `state` constant below.
    This constant is not exposed to any part of the app. Instead,
    values are subscribed to through the `Selectors` constant, and
    the state management logic is notified of the need for updating through the `Actions` constant.
*/

//#region state setup
type State = {
    language: Language;
    showChangelog: boolean;
    // This is a stack of the cross-references selected by the user. The most recent selection is at the end of the array.
    selectedCrossReferences: Array<NumberOrNumberRange>;
};

const state = signal<State>({
    language: Language.ENGLISH,
    showChangelog: false,
    selectedCrossReferences: [],
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

//#region helper functions
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

function updateLanguage(language: Language): void {
    state.value = { ...state.value, language };
}

function selectCrossReference(reference: NumberOrNumberRange): void {
    if (state.value.selectedCrossReferences.at(-1) !== reference) {
        const selectedCrossReferences = state.value.selectedCrossReferences.concat(reference);
        state.value = { ...state.value, selectedCrossReferences };
    }
}

function clearCrossReferenceSelection(): void {
    state.value = { ...state.value, selectedCrossReferences: [] };
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
        selected: computed(() => state.value.selectedCrossReferences),
    },
} as const;
//#endregion
