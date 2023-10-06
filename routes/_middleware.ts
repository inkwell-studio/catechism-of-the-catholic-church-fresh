import { MiddlewareHandlerContext } from '$fresh/server.ts';

import { getLanguageInfo } from '../catechism/source/utils/language.ts';
import { getLanguageTag } from '../web/language-tag.ts';
import { getUrlByParagraphNumber } from '../web/routing.ts';
import { Actions, Selectors } from '../web/state.ts';

export async function handler(request: Request, context: MiddlewareHandlerContext): Promise<Response> {
    if ('route' === context.destination) {
        // Use the root route param to conditionally update the language or navigate by paragraph number
        const languageInfo = getLanguageInfo(context.params.language);
        if (languageInfo.language && languageInfo.supported) {
            Actions.language.update(languageInfo.language);
        } else if (!context.params.path) {
            const paragraphNumberNavigationUrl = getUrlByParagraphNumber(
                context.params.language,
                Selectors.language.value,
                request,
            );
            if (paragraphNumberNavigationUrl) {
                return Response.redirect(paragraphNumberNavigationUrl, 307);
            }
        }
    }

    const response = await context.next();

    if ('route' === context.destination) {
        response.headers.set('Content-Language', getLanguageTag(Selectors.language.value));

        // Use the non-root route params to conditionally navigate by paragraph number
        const paragraphNumberNavigationUrl = getUrlByParagraphNumber(
            context.params.path,
            Selectors.language.value,
            request,
        );
        if (paragraphNumberNavigationUrl) {
            return Response.redirect(paragraphNumberNavigationUrl, 307);
        }
    }

    return response;
}
