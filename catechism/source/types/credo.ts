import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';

export interface Credo extends ContentBase {
    readonly contentType: Content.SPECIAL_1;
}
