import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { TextContent } from './text-content.ts';
import { TextKey } from './text-key.ts';

export type ParagraphGroup = ContentBase & ContentContainer & {
    readonly contentType: Content.PARAGRAPH_GROUP;
    readonly paragraphGroupNumber: number;
    readonly title: TextKey;
    readonly mainContent: Array<TextContent>;
};
