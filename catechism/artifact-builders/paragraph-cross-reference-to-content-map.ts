import { ParagraphNumberContentMap } from '../source/types/paragraph-number-content-map.ts';
import { ParagraphCrossReferenceContentMap } from '../source/types/types.ts';
import { getParagraphNumbers, getTextWrappers } from '../source/utils/content.ts';

export function build(contentMap: ParagraphNumberContentMap): ParagraphCrossReferenceContentMap {
    const crossReferenceContentMap: ParagraphCrossReferenceContentMap = {};

    Object.values(contentMap)
        .flatMap((paragraph) => getTextWrappers(paragraph))
        .filter((textWrapper) => textWrapper.paragraphReferences.length > 0)
        .flatMap((textWrapper) => textWrapper.paragraphReferences)
        .forEach((crossReference) => {
            const paragraphs = getParagraphNumbers([crossReference])
                .map((paragraphNumber) => contentMap[paragraphNumber]);

            crossReferenceContentMap[crossReference] = paragraphs;
        });

    return crossReferenceContentMap;
}
