import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { NumberOrNumberRange } from './number-or-number-range.ts';
import { Reference } from './reference.ts';
import { Text } from './text.ts';

export interface TextWrapper extends ContentBase, ContentContainer {
    readonly contentType: Content.TEXT_WRAPPER;
    readonly openingContent: Array<never>;
    readonly mainContent: Array<Text>;
    readonly references: Array<Reference>;
    // Cross-references to other Catechism paragraphs
    readonly paragraphReferences: Array<NumberOrNumberRange>;
}
