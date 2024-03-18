import { Language } from '../../../catechism/source/types/types.ts';

export function getLanguageTag(language: Language): LanguageTag {
    switch (language) {
        case Language.ENGLISH:
            return LanguageTag.ENGLISH;
        case Language.LATIN:
            return LanguageTag.LATIN;
        case Language.SPANISH:
            return LanguageTag.SPANISH;
        default:
            return LanguageTag.ENGLISH;
    }
}

enum LanguageTag {
    ENGLISH = 'en-US',
    LATIN = 'la',
    SPANISH = 'es',
}
