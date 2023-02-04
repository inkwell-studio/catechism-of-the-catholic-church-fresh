import { Part } from './part.ts';
import { Prologue } from './prologue.ts';

export type CatechismStructure = {
    readonly prologue: Prologue;
    readonly parts: Array<Part>;
};
