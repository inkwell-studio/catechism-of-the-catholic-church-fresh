import { ContentBase } from './content-base.ts';

export interface ContentContainer {
    readonly mainContent: Array<ContentBase>;
}
