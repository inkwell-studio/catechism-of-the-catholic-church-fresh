import { ParagraphNumberContentMap } from '../source/types/paragraph-number-content-map.ts';
import { ParagraphNumberCrossReferenceMap } from '../source/types/types.ts';
import { getParagraphNumbers, getTextWrappers } from "../source/utils/content.ts";

export function build(contentMap: ParagraphNumberContentMap): ParagraphNumberCrossReferenceMap {
    const crossReferenceMap: ParagraphNumberCrossReferenceMap = {};

    Object.entries(contentMap).forEach(([ paragraphNumberString, paragraph ]) => {
        const paragraphNumber = Number(paragraphNumberString);

        const crossReferences = getTextWrappers(paragraph)
            .flatMap((textWrapper) => getParagraphNumbers(textWrapper.paragraphReferences))
            .flatMap(paragraphNumber => contentMap[paragraphNumber]);

        if (crossReferences.length > 0) {
            crossReferenceMap[paragraphNumber] = crossReferences;
        }
    });

    return crossReferenceMap;
}
