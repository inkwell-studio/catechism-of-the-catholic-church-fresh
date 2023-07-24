import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { Paragraph } from './paragraph.ts';
import { ParagraphGroup } from './paragraph-group.ts';
import { Section } from './section.ts';
import { SpecialContent } from './special-content.ts';
import { TextKey } from './text-key.ts';

export interface Part extends ContentBase, ContentContainer {
    readonly contentType: Content.PART;
    readonly partNumber: number;
    readonly title: TextKey;
    readonly openingContent: Array<ParagraphGroup | Paragraph>;
    readonly mainContent: Array<Section | SpecialContent>;
}
