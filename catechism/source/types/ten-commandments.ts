import { Content } from './content.ts';
import { ContentBase } from './content-base.ts';

export type TenCommandments = ContentBase & {
    readonly contentType: Content.SPECIAL_2;
};
