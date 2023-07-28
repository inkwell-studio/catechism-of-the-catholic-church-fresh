import { getTitleText } from './general.ts';
import { buildParagraph } from './paragraph.ts';
import { buildParagraphGroup } from './paragraph-group.ts';
import { Limits, Probability } from '../config.ts';
import { chance, intArrayOfRandomLength, randomInt } from '../../utils.ts';
import { Content, Paragraph, ParagraphGroup, Subarticle, TextKey } from '../../../source/types/types.ts';

export function buildSubarticle(i: number): Subarticle {
    return {
        contentType: Content.SUB_ARTICLE,
        // This will be set later, after all content is created
        pathID: '0',
        subarticleNumber: i,
        title: getTitleText(Content.SUB_ARTICLE, i) as TextKey,
        openingContent: [],
        mainContent: buildContent(),
        finalContent: [],
    };
}

function buildContent(): Array<ParagraphGroup | Paragraph> {
    const numItems = randomInt(Limits.subarticle.contentItems);

    const items = [];
    let paragraphGroupIndex = 0;
    for (let i = 0; i < numItems; i++) {
        const createParagraphGroup = chance(Probability.subarticle.paragraphGroup);
        if (createParagraphGroup) {
            items.push(buildParagraphGroup(paragraphGroupIndex++));
        } else {
            const textContent = intArrayOfRandomLength(Limits.subarticle.textContent).map(() => buildParagraph());
            items.push(...textContent);
        }
    }

    return items;
}
