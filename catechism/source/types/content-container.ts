import { ContentBase } from './content-base.ts';

export interface ContentContainer {
    readonly openingContent: Array<ContentBase>;
    readonly mainContent: Array<ContentBase>;
}
