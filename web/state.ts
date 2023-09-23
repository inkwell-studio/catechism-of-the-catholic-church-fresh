import { signal } from '@preact/signals';
import { Language, NumberOrNumberRange } from '../catechism/source/types/types.ts';

export type State = {
    testValue: string;
    language: Language;
    // This is a stack of the cross-references selected by the user. The most recent selection is at the end of the array.
    selectedCrossReferences: Array<NumberOrNumberRange>;
    showChangelog: boolean;
};

const initialState: State = {
    testValue: 'initial',
    language: Language.ENGLISH,
    selectedCrossReferences: [],
    showChangelog: false,
};
export const state = signal<State>(initialState);

export function updateLanguage(language: Language): void {
    state.value = { ...state.value, language };
}

export function selectCrossReference(reference: NumberOrNumberRange): void {
    if (state.value.selectedCrossReferences.at(-1) !== reference) {
        const selectedCrossReferences = state.value.selectedCrossReferences.concat(reference);
        state.value = { ...state.value, selectedCrossReferences };
    }
}

export function clearCrossReferenceSelection(): void {
    state.value = { ...state.value, selectedCrossReferences: [] };
}



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
