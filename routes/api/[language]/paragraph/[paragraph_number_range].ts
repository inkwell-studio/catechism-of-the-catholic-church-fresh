import { Handlers } from '$fresh/server.ts';

import { NumberOrNumberRange, Paragraph } from '../../../../catechism/source/types/types.ts';
import { getParagraphCrossReferenceContentMap } from '../../../../catechism/source/utils/artifacts.ts';
import { getLanguageInfo } from '../../../../catechism/source/utils/language.ts';

export const handler: Handlers<Paragraph | null> = {
    async GET(_request, context) {
        const languageInfo = getLanguageInfo(context.params.language);
        if (languageInfo.language && languageInfo.supported) {
            // TODO: Use the simpler `paragraph-number_to_content-en.json` content map instead, and remove all logic and data of this ~`paragraph-cross-reference-to-content` content map
            const contentMap = await getParagraphCrossReferenceContentMap(languageInfo.language);
            const selection = context.params['paragraph_number_range'] as NumberOrNumberRange;
            return new Response(JSON.stringify(contentMap[selection]));
        } else {
            return new Response(null);
        }
    },
};
