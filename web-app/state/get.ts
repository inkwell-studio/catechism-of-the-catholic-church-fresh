import { Catechism } from '../../content/source/catechism.ts';
import { Text } from '../../content/source/text/text-en.ts';
import { Part, PathID, TextKey } from '../../content/source/types/types.ts';

// TODO: Rename `_path` as `path` when used
export function getContent(_path: PathID): Array<Part> {
    // TODO: Implement
    return Catechism.parts;
}

export function getText(key: TextKey): string {
    return Text[key];
}
