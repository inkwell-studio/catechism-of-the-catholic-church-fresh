import { ContentBase } from './content-base.ts';

export interface ContentContainer extends ContentBase {
    readonly openingContent: Array<ContentBase>;
    readonly mainContent: Array<ContentBase>;
    readonly finalContent: Array<ContentBase>;
}
