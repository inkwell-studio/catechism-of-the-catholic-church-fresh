import { MiddlewareHandlerContext } from '$fresh/server.ts';

import { Language } from '../catechism/source/types/types.ts';
import { getParagraphNumberUrlMap } from '../catechism/source/utils/artifacts.ts';
import { getLanguageInfo } from '../catechism/source/utils/language.ts';
import { getLanguageTag } from '../web/language-tag.ts';
import { Actions, Selectors } from '../web/state.ts';

export async function handler(request: Request, context: MiddlewareHandlerContext): Promise<Response> {
    if ('route' === context.destination) {
        // Use the root route param to conditionally update the language or navigate by paragraph number
        const languageInfo = getLanguageInfo(context.params.language);
        if (languageInfo.language && languageInfo.supported) {
            Actions.language.update(languageInfo.language);
        } else if (!context.params.path) {
            const paragraphNumberNavigationUrl = await getParagraphNumberNavigationUrl(
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
        const paragraphNumberNavigationUrl = await getParagraphNumberNavigationUrl(
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

async function getParagraphNumberNavigationUrl(
    param: string,
    language: Language,
    request: Request,
): Promise<string | null> {
    const paragraphNumber = getPotentialParagraphNumber(param);

    if (paragraphNumber) {
        const urlMap = await getParagraphNumberUrlMap(language);
        const path = urlMap[paragraphNumber];
        if (path) {
            return (new URL(request.url)).origin + path;
        }
    }

    return null;
}

function getPotentialParagraphNumber(value = ''): number | null {
    const numberValue = Number(value);
    return !isNaN(numberValue) && numberValue > 0 ? numberValue : null;
}
