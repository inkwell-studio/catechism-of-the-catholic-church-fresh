import { Handlers } from '$fresh/server.ts';

import { NumberOrNumberRange, Paragraph } from '../../../../catechism/source/types/types.ts';
import { getParagraphCrossReferenceContentMap } from '../../../../catechism/source/utils/artifacts.ts';
import { getLanguageInfo } from '../../../../catechism/source/utils/language.ts';

export const handler: Handlers<Paragraph | null> = {
    async GET(_request, context) {
        const languageInfo = getLanguageInfo(context.params.language);
        if (languageInfo.language && languageInfo.supported) {
            const contentMap = await getParagraphCrossReferenceContentMap(languageInfo.language);
            const selection = context.params['paragraph-number-range'] as NumberOrNumberRange;
            // TODO: Finish
            // return new Response(JSON.stringify(contentMap[selection]));
            return new Response(JSON.stringify({ test: '123abc' }));
        } else {
            return new Response(null);
        }
    },
};
