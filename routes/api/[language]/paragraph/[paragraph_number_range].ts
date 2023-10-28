import { Handlers } from '$fresh/server.ts';

import { NumberOrNumberRange, Paragraph } from '../../../../catechism/source/types/types.ts';
import { getParagraphNumberContentMap } from '../../../../catechism/source/utils/artifacts.ts';
import { getParagraphNumbers } from '../../../../catechism/source/utils/content.ts';
import { getLanguageInfo } from '../../../../catechism/source/utils/language.ts';

export const handler: Handlers<Paragraph | null> = {
    async GET(_request, context) {
        const languageInfo = getLanguageInfo(context.params.language);
        if (languageInfo.language && languageInfo.supported) {
            // Convert hyphens to en dashes
            const selection = context.params['paragraph_number_range'].replaceAll('-', '–') as NumberOrNumberRange;
            const paragraphNumbers = getParagraphNumbers(selection);

            const contentMap = await getParagraphNumberContentMap(languageInfo.language);
            const paragraphs = paragraphNumbers
                .map((n) => contentMap[n])
                .filter((paragraph) => paragraph);

            return new Response(JSON.stringify(paragraphs));
        } else {
            return new Response(null);
        }
    },
};
