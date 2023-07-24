import { Part } from './part.ts';
import { Prologue } from './prologue.ts';

export interface CatechismStructure {
    readonly prologue: Prologue;
    readonly parts: Array<Part>;
}
