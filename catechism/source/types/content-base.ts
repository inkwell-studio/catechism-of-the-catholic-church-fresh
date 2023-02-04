import { Content } from './content.ts';
import { PathID } from './path-id.ts';

export interface ContentBase {
    readonly contentType: Content;
    readonly pathID: PathID;
}
