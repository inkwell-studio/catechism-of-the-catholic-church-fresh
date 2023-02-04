import { signal } from '@preact/signals';
import { PathID } from '../../catechism/source/types/types.ts';

export type State = {
    path: PathID;
};

const initialState = { path: '0' as PathID };
export const state = signal<State>(initialState);
