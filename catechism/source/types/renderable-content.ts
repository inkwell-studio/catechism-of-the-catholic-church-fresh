import { ContentContainer } from './content-container.ts';
import { Paragraph } from './paragraph.ts';

export interface RenderableContent {
    content: ContentContainer;
    crossReferences: Array<Paragraph>;
}
