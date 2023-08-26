import { signal } from '@preact/signals';
import { PathID } from '../catechism/source/types/types.ts';

export type State = {
    showChangelog: boolean;
    path: PathID;
};

const initialState: State = {
    showChangelog: false,
    path: '0',
};
export const state = signal<State>(initialState);
