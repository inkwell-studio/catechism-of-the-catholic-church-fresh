import { signal } from '@preact/signals';
import { Language } from '../catechism/source/types/types.ts';

export type State = {
    language: Language;
    showChangelog: boolean;
};

const initialState: State = {
    language: Language.ENGLISH,
    showChangelog: false,
};
export const state = signal<State>(initialState);

export function updateLanguage(language: Language): void {
    state.value = { ...state.value, language };
}
