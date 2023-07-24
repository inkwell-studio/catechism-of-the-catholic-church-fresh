import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';
import { ContentContainer } from './content-container.ts';
import { Paragraph } from './paragraph.ts';
import { TextKey } from './text-key.ts';

/**
 * This object contains content that exists at the same level as another content type,
 * but is not an actual instance of that content type (see the container for paragraphs 2566-2567 for an example).
 */
export interface GenericContentContainer extends ContentBase, ContentContainer {
    readonly contentType: Content.GENERIC_CONTENT_CONTAINER;
    // The entries for the the `tier` discriminated union is meant to be added to as necessary
    readonly tier: Content.ARTICLE;
    readonly title: TextKey;
    readonly openingContent: Array<never>;
    readonly mainContent: Array<Paragraph>;
}
