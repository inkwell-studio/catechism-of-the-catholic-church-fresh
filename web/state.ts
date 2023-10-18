import { IS_BROWSER } from '$fresh/runtime.ts';
import { batch, computed, effect, Signal, signal } from '@preact/signals';

import * as server from './server.ts';
import {
    Language,
    NumberOrNumberRange,
    Paragraph,
    PathID,
    RenderableNode,
    RenderableNodeMap,
} from '../catechism/source/types/types.ts';
import { getRenderableNodeMap } from '../catechism/source/utils/artifacts.ts';
import { getLanguageInfo } from '../catechism/source/utils/language.ts';

/*
    The state is contained in the `state` constant below.
    This constant is not exposed to any part of the app. Instead,
    values are subscribed to through the `Selectors` constant, and
    the state management logic is notified of the need for updating through the `Actions` constant.
*/

//#region state
type State = {
    crossReference: {
        selectedContent: Signal<Array<Paragraph>>;
        // A stack of the cross-references selected by the user. The most recent selection is at the end of the array.
        selectionHistory: Signal<Array<NumberOrNumberRange>>;
    };
    language: Signal<Language>;
    navigation: {
        currentRenderableNode: Signal<RenderableNode | null>;
        renderableNodeMap: Signal<RenderableNodeMap | null>;
    };
    showChangelog: Signal<boolean>;
};

const initialLanguage = determineInitialLanguage();

const state: State = {
    crossReference: {
        selectedContent: signal([]),
        selectionHistory: signal([]),
    },
    language: signal(initialLanguage),
    navigation: {
        currentRenderableNode: signal(null),
        renderableNodeMap: signal(null),
    },
    showChangelog: signal(false),
};

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
    crossReference: {
        select: selectCrossReference,
        selectFromHistory: selectCrossReferenceFromHistory,
        clearSelection: clearCrossReferenceSelection,
        navigateTo: navigateToSelectedCrossReference,
    },
    language: {
        update: updateLanguage,
    },
    navigation: {
        setCurrentRenderableNode: setCurrentRenderableNode,
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
    const selectedParagraph = state.crossReference.selectedContent.value[0];
    if (IS_BROWSER && selectedParagraph) {
        clearCrossReferenceSelection();
        window.location.href = new URL(window.location.href).origin + selectedParagraph.url;
    }
}
//#endregion

//#region language
function updateLanguage(language: Language): void {
    state.language.value = language;
}
//#endregion

//#region navigation
//#endregion
function setCurrentRenderableNode(pathID: PathID | null): void {
    if (pathID) {
        const map = state.navigation.renderableNodeMap.value;
        if (map) {
            const mapEntry = map[pathID];
            if (mapEntry) {
                state.navigation.currentRenderableNode.value = mapEntry.here;
            } else {
                console.error(`A RenderableNode entry could not be found for PathID ${pathID}`);
                state.navigation.currentRenderableNode.value = null;
            }
        } else {
            console.error(`A RenderableNode map could not be found for PathID ${pathID}`);
            state.navigation.currentRenderableNode.value = null;
        }
    } else {
        state.navigation.currentRenderableNode.value = null;
    }
}
//#endregion

//#region Selectors
// Selectors are named as: [noun].[verb]
export const Selectors = {
    changelog: {
        show: computed(() => state.showChangelog.value),
    },
    crossReference: {
        selectedContent: computed(() => state.crossReference.selectedContent.value),
        selectionHistory: computed(() => state.crossReference.selectionHistory.value),
    },
    language: computed(() => state.language.value),
    navigation: {
        nextNode: computed(() => {
            const currentNode = state.navigation.currentRenderableNode.value;
            const map = state.navigation.renderableNodeMap.value;
            return currentNode && map ? map[currentNode.pathID].next ?? null : null;
        }),
        previousNode: computed(() => {
            const currentNode = state.navigation.currentRenderableNode.value;
            const map = state.navigation.renderableNodeMap.value;
            return currentNode && map ? map[currentNode.pathID].previous ?? null : null;
        }),
    },
} as const;
//#endregion

//#region Effects
effect(() => {
    if (!IS_BROWSER) {
        updateRenderableNodeMap(state.language.value);
    }
});
//#endregion

//#region helper functions
async function updateRenderableNodeMap(language: Language): Promise<void> {
    const map = await getRenderableNodeMap(language);
    state.navigation.renderableNodeMap.value = map;
}
//#endregion
