import { Content } from './content.ts';
import { PathID } from './path-id.ts';
import { SemanticPath } from './semantic-path.ts';

export interface TableOfContentsType {
    readonly prologue: TableOfContentsEntry;
    readonly parts: Array<TableOfContentsEntry>;
}

export interface TableOfContentsEntry {
    readonly contentType: Content;
    readonly title: string;
    readonly pathID: PathID;
    readonly semanticPath: SemanticPath;
    readonly firstParagraphNumber: number;
    readonly children: Array<TableOfContentsEntry>;
}
