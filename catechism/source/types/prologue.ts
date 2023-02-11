import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { Subarticle } from './subarticle.ts';
import { TextContent } from './text-content.ts';
import { TextKey } from './text-key.ts';

export type Prologue = ContentBase & ContentContainer & {
    readonly contentType: Content.PROLOGUE;
    readonly title: TextKey;
    readonly mainContent: Array<Subarticle | TextContent>;
};
