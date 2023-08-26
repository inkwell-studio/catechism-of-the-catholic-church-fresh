import { ContentContainer } from './content-container.ts';
import { PathID } from './path-id.ts';

export type PathIdContentMap = {
    [key: PathID]: ContentContainer;
};
