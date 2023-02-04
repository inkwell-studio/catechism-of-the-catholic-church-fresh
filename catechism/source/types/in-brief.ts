import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { Paragraph } from './paragraph.ts';

export type InBrief = ContentBase & ContentContainer & {
    readonly contentType: Content.IN_BRIEF;
    readonly mainContent: Array<Paragraph>;
};
