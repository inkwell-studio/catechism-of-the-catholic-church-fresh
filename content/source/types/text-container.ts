import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { NumberOrNumberRange } from './number-or-number-range.ts';
import { Reference } from './reference.ts';
import { Text } from './text.ts';

export type TextContainer = ContentBase & ContentContainer & {
    readonly contentType: Content.TEXT_CONTAINER;
    readonly mainContent: Array<Text>;
    readonly references: Array<Reference>;
    // Cross-references to other Catechism paragraphs
    readonly paragraphReferences: Array<NumberOrNumberRange>;
};
