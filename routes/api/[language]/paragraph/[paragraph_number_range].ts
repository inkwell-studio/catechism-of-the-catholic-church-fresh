import { Handlers } from '$fresh/server.ts';

import { NumberOrNumberRange, Paragraph } from '../../../../catechism/source/types/types.ts';
import { getLanguageInfo } from '../../../../catechism/source/utils/language.ts';

export const handler: Handlers<Paragraph | null> = {
    async GET(_request, context) {
        const languageInfo = getLanguageInfo(context.params.language);
        if (languageInfo.language && languageInfo.supported) {
            // TODO: Use the `paragraph-number_to_content-en.json` content map
            const selection = context.params['paragraph_number_range'] as NumberOrNumberRange;

            return new Response(JSON.stringify({}));
        } else {
            return new Response(null);
        }
    },
};
