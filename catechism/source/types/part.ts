import { Content } from './content.ts';
import { ContentContainer } from './content-container.ts';
import { Paragraph } from './paragraph.ts';
import { ParagraphGroup } from './paragraph-group.ts';
import { Section } from './section.ts';
import { SpecialContent } from './special-content.ts';
import { TextKey } from './text-key.ts';

export interface Part extends ContentContainer {
    readonly contentType: Content.PART;
    readonly partNumber: number;
    readonly title: TextKey;
    readonly openingContent: Array<ParagraphGroup | Paragraph>;
    readonly mainContent: Array<Section | SpecialContent>;
    readonly finalContent: Array<never>;
}
