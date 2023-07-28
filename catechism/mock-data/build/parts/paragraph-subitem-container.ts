import { buildParagraphSubitem } from './paragraph-subitem.ts';
import { Limits } from '../config.ts';
import { intArrayOfRandomLength, randomBoolean } from '../../utils.ts';
import { Content, ParagraphSubitem, ParagraphSubitemContainer } from '../../../source/types/types.ts';

export function buildParagraphSubitemContainer(): ParagraphSubitemContainer {
    return {
        contentType: Content.PARAGRAPH_SUB_ITEM_CONTAINER,
        // This will be set later, after all content is created
        pathID: '0',
        ordered: randomBoolean(),
        openingContent: [],
        mainContent: buildContent(),
        finalContent: [],
    };
}

function buildContent(): Array<ParagraphSubitem> {
    return intArrayOfRandomLength(Limits.paragraphSubitemContainer.subitems).map(() => buildParagraphSubitem());
}
