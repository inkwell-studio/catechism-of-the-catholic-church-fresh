import { buildSubarticle } from './subarticle.ts';
import { buildTextBlock } from './text-block.ts';

import { getTitleText } from './general.ts';
import { intArrayOfRandomLength } from '../../utils.ts';

import { Limits } from '../config.ts';
import { Content, PathID, Prologue, Subarticle, TextContent, TextKey } from '../../../source/types/types.ts';

export function buildPrologue(pathID: PathID): Prologue {
    return {
        contentType: Content.PROLOGUE,
        pathID,
        title: getTitleText(Content.PROLOGUE, 1) as TextKey,
        openingContent: buildOpeningContent(),
        mainContent: buildMainContent(),
    };
}

function buildOpeningContent(): Array<TextContent> {
    return intArrayOfRandomLength(Limits.prologue.text).map(() => buildTextBlock());
}

function buildMainContent(): Array<Subarticle> {
    return intArrayOfRandomLength(Limits.prologue.subarticles).map((i) => buildSubarticle(i));
}
