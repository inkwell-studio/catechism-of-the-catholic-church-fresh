import { signal } from '@preact/signals';
import { Language, Paragraph } from '../catechism/source/types/types.ts';

export type State = {
    language: Language;
    showChangelog: boolean;
    selectedCrossReference: Paragraph | null;
};

const initialState: State = {
    language: Language.ENGLISH,
    showChangelog: false,
    selectedCrossReference: null,
};
export const state = signal<State>(initialState);

export function updateLanguage(language: Language): void {
    state.value = { ...state.value, language };
}
