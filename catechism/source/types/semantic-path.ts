import { Content } from './content.ts';

export type SemanticPath =
    | `${string}`
    | `${string}/${string}`
    | `${string}/${string}/${string}`
    | `${string}/${string}/${string}/${string}`
    | `${string}/${string}/${string}/${string}/${string}`
    | `${string}/${string}/${string}/${string}/${string}/${string}`
    | `${string}/${string}/${string}/${string}/${string}/${string}/${string}`;

export type SemanticPathSource = {
    content: Content;
    number: number | null;
    isFinalContent: boolean;
};
