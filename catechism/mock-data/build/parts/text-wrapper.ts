import { buildReferences } from './general.ts';
import { buildText } from './text.ts';
import { Limits } from '../config.ts';
import { intArrayOfRandomLength } from '../../utils.ts';
import { Content, Text, TextWrapper } from '../../../source/types/types.ts';

export function buildTextWrapper(): TextWrapper {
    return {
        contentType: Content.TEXT_WRAPPER,
        // This will be set later, after all content is created
        pathID: '0',
        openingContent: [],
        mainContent: buildContent(),
        finalContent: [],
        references: buildReferences(),
        // These are set later, after all content is created
        paragraphReferences: [],
    };
}

function buildContent(): Array<Text> {
    return intArrayOfRandomLength(Limits.textWrapper.parts).map(() => buildText());
}
