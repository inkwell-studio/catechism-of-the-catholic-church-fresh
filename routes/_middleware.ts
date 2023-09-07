import { MiddlewareHandlerContext } from '$fresh/server.ts';

import { getLanguageInfo } from '../catechism/source/utils/language.ts';
import { getLanguageTag } from '../web/language-tag.ts';
import { state, updateLanguage } from '../web/state.ts';

export async function handler(_request: Request, context: MiddlewareHandlerContext) {
    if ('route' === context.destination) {
        const languageInfo = getLanguageInfo(context.params.language);
        if (languageInfo.language && languageInfo.supported) {
            updateLanguage(languageInfo.language);
        }
    }

    const response = await context.next();

    if ('route' === context.destination) {
        response.headers.set('Content-Language', getLanguageTag(state.value.language));
    }

    return response;
}
