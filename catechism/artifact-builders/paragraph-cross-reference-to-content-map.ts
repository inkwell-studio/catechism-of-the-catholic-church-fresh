import { ParagraphNumberContentMap } from '../source/types/paragraph-number-content-map.ts';
import { ParagraphCrossReferenceContentMap } from '../source/types/types.ts';
import { getParagraphNumbers, getTextWrappers } from '../source/utils/content.ts';

export function build(contentMap: ParagraphNumberContentMap): ParagraphCrossReferenceContentMap {
    return Object.values(contentMap)
        .flatMap((paragraph) => getTextWrappers(paragraph))
        .filter((textWrapper) => textWrapper.paragraphReferences.length > 0)
        .flatMap((textWrapper) => textWrapper.paragraphReferences)
        /*/
            .map((crossReference) => {
                const paragraphs = getParagraphNumbers([crossReference])
                .map((paragraphNumber) => contentMap[paragraphNumber]);

                return { [crossReference]:  paragraphs }
                /*/
        .map((crossReference) => ({
            [crossReference]: getParagraphNumbers([crossReference])
                .map((paragraphNumber) => contentMap[paragraphNumber]),
        }))
        .reduce((previous, current) => ({ ...previous, ...current }), {});
}
