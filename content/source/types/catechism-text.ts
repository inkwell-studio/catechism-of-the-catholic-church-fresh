import { TextKey } from './text-key.ts';

export type CatechismText = {
    readonly [t in TextKey]: string;
};
