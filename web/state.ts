import { computed, effect, signal } from '@preact/signals';
import { ContentContainer, Language, NumberOrNumberRange, Paragraph } from '../catechism/source/types/types.ts';

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
    content: {
        active: ContentContainer | null;
    };
    crossReference: {
        selectedContent: Array<Paragraph>;
        // A stack of the cross-references selected by the user. The most recent selection is at the end of the array.
        selectionHistory: Array<NumberOrNumberRange>;
    };
};

const state = signal<State>({
    language: Language.ENGLISH,
    showChangelog: false,
    content: {
        active: null,
    },
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
    content: {
        updateActive: updateActiveContent,
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

//#region content
function updateActiveContent(content: ContentContainer): void {
    state.value = {
        ...state.value,
        content: {
            ...state.value.content,
            active: content,
        },
    };
}
//#endregion

//#region cross-references
function selectCrossReference(reference: NumberOrNumberRange): void {
    // TODO: Enforce a limit on the maximum number of selections (once exceeded, remove the oldest reference and add the new one)
    if (state.value.crossReference.selectionHistory.at(-1) !== reference) {
        const selectionHistory = state.value.crossReference.selectionHistory.concat(reference);
        updateCrossReferenceSelections(selectionHistory);
    }
}

function clearCrossReferenceSelection(): void {
    updateCrossReferenceSelections([]);
}

function updateCrossReferenceSelections(selectionHistory: Array<NumberOrNumberRange>): void {
    state.value = {
        ...state.value,
        crossReference: {
            ...state.value.crossReference,
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
    content: {
        active: computed(() => state.value.content.active),
    },
    crossReference: {
        selectionHistory: computed(() => state.value.crossReference.selectionHistory),
    },
} as const;
//#endregion

//#region Effects
effect(() => {
    const latestSelection = state.value.crossReference.selectionHistory.at(-1);
    if (latestSelection) {
        loadCrossReferences;
        // TODO: Dispatch an action to update the state after the data has been loaded
    }
});
//#endregion
