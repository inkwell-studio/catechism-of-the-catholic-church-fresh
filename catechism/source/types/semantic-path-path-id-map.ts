import { PathID } from './path-id.ts';
import { SemanticPath } from './semantic-path.ts';

export type SemanticPathPathIdMap = {
    [key: SemanticPath]: PathID;
};
