import { IS_BROWSER } from '$fresh/runtime.ts';
import { batch, computed, Signal, signal } from '@preact/signals';

import * as server from './server.ts';
import { getUrlByParagraphNumber } from './routing.ts';
import { Language, NumberOrNumberRange, Paragraph } from '../catechism/source/types/types.ts';
import { getLanguageInfo } from '../catechism/source/utils/language.ts';

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

const initialLanguage = determineInitialLanguage();

const state: State = {
    language: signal(initialLanguage),
    showChangelog: signal(false),
    crossReference: {
        selectedContent: signal([]),
        selectionHistory: signal([]),
    },
};

const CROSS_REFERENCE_HISTORY_LIMIT = 7;

function determineInitialLanguage(): Language {
    if (IS_BROWSER) {
        const languageParam = new URL(window.location.href).pathname.split('/')[1];
        const languageInfo = getLanguageInfo(languageParam);
        if (languageInfo.language && languageInfo.supported) {
            return languageInfo.language;
        }
    }

    return Language.ENGLISH;
}
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
        navigateTo: navigateToSelectedCrossReference,
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
function clearCrossReferenceSelection(): void {
    batch(() => {
        state.crossReference.selectionHistory.value = [];
        state.crossReference.selectedContent.value = [];
    });
}

function selectCrossReference(reference: NumberOrNumberRange): void {
    if (state.crossReference.selectionHistory.value.at(-1) !== reference) {
        const selectionHistory = state.crossReference.selectionHistory.value.concat(reference);
        if (selectionHistory.length > CROSS_REFERENCE_HISTORY_LIMIT) {
            selectionHistory.shift();
        }
        batch(() => {
            state.crossReference.selectionHistory.value = selectionHistory;
            loadCrossReferenceSelectedContent(reference);
        });
    }
}

function selectCrossReferenceFromHistory(index: number): void {
    const selectionHistory = state.crossReference.selectionHistory.value.slice(0, index + 1);
    batch(() => {
        state.crossReference.selectionHistory.value = selectionHistory;
        loadCrossReferenceSelectedContent(selectionHistory.at(-1) as NumberOrNumberRange);
    });
}

async function loadCrossReferenceSelectedContent(paragraphNumbers: NumberOrNumberRange): Promise<void> {
    const paragraphs = await server.getParagraphs(paragraphNumbers, state.language.value);
    state.crossReference.selectedContent.value = paragraphs;
}

function navigateToSelectedCrossReference(): void {
    if (IS_BROWSER && state.crossReference.selectedContent.value.length > 0) {
        const url = getUrlByParagraphNumber(
            state.crossReference.selectedContent.value[0].paragraphNumber,
            state.language.value,
        );
        if (url) {
            clearCrossReferenceSelection();
            window.location.href = url;
        }
    }
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
