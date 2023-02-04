import { Catechism } from '../../catechism/source/catechism.ts';
import { Text } from '../../catechism/source/text/text-en.ts';
import { Part, PathID, TextKey } from '../../catechism/source/types/types.ts';

// deno-lint-ignore no-unused-vars
export function getContent(path: PathID): Part {
    // TODO: Implement
    return Catechism.parts[0];
}

export function getText(key: TextKey): string {
    return Text[key];
}
