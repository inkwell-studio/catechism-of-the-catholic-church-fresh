import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';

export type Credo = ContentBase & {
    readonly contentType: Content.SPECIAL_1;
};
