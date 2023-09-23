import { computed, signal } from '@preact/signals';
import { Language, NumberOrNumberRange } from '../catechism/source/types/types.ts';

//#region state setup
type State = {
    language: Language;
    showChangelog: boolean;
    // This is a stack of the cross-references selected by the user. The most recent selection is at the end of the array.
    selectedCrossReferences: Array<NumberOrNumberRange>;
    // TODO: Remove
    testValue: string;
};

const state = signal<State>({
    language: Language.ENGLISH,
    showChangelog: false,
    selectedCrossReferences: [],
    // TODO: Remove
    testValue: 'initial',
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


    // TODO: Remove
    test: {
        invoke: invokeTest,
    }
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
    // TODO: Remove
    testValue: computed(() => state.value.testValue),
} as const;
//#endregion








// TODO: Remove all of the following
//#region scratch
export function invokeTest(): void {
    updateTest();
}

async function updateTest(): Promise<void> {
    const nextValue = await test();
    const testValue = state.value.testValue + nextValue;

    state.value = { ...state.value, testValue };
}

function test(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(' | ' + new Date().getTime());
        }, 2000);
    })
}
//#endregion
