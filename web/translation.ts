import { Content, Language } from '../catechism/source/types/types.ts';

export function translate(englishText: string, language: Language): string {
    try {
        return Language.ENGLISH === language ? englishText : translationMap[englishText][language];
    } catch (error) {
        throw new Error(`Failed translation into [${language}]: ${englishText}`, error);
    }
}

const translationMap: Record<string, Record<Exclude<Language, Language.ENGLISH>, string>> = {
    'Server Error': {
        [Language.LATIN]: 'Servo Errore',
        [Language.SPANISH]: 'Error del Servidor',
    },
    'Page not found.': {
        [Language.LATIN]: 'Pagina non inveni.',
        [Language.SPANISH]: 'Página no encontrada.',
    },
    'Unknown page:': {
        [Language.LATIN]: 'ignota pagina:',
        [Language.SPANISH]: 'Pagina desconocida:',
    },
    'Go Home': {
        [Language.LATIN]: 'Redira ad Initium',
        [Language.SPANISH]: 'Volver a Empezar',
    },
    'Unsupported language': {
        [Language.LATIN]: 'Sine lingua',
        [Language.SPANISH]: 'Idioma no admitido',
    },
    'Available languages': {
        [Language.LATIN]: 'Linguae Available',
        [Language.SPANISH]: 'Idiomas Disponibles',
    },
    'Catechism of the Catholic Church': {
        [Language.LATIN]: 'Catechismus Catholicae Ecclesiae',
        [Language.SPANISH]: 'Catecismo de la Iglesia Católica',
    },
    'Table of Contents': {
        [Language.LATIN]: 'Index Generalis',
        [Language.SPANISH]: 'Índice General',
    },
    'prologue': {
        [Language.LATIN]: 'prooemium',
        [Language.SPANISH]: 'prologo',
    },
    'part': {
        [Language.LATIN]: 'pars',
        [Language.SPANISH]: 'parte',
    },
    'section': {
        [Language.LATIN]: 'sectio',
        [Language.SPANISH]: 'seccion',
    },
    'chapter': {
        [Language.LATIN]: 'caput',
        [Language.SPANISH]: 'capitulo',
    },
    'chapter-section': {
        [Language.LATIN]: 'caput-sectio',
        [Language.SPANISH]: 'capitulo-seccion',
    },
    'article': {
        [Language.LATIN]: 'articulus',
        [Language.SPANISH]: 'articulo',
    },
    'article-paragraph': {
        [Language.LATIN]: 'articulus-paragraphus',
        [Language.SPANISH]: 'articulo-parrafo',
    },
    'In Brief': {
        [Language.LATIN]: 'Compendium',
        [Language.SPANISH]: 'Resumen',
    },
    'in-brief': {
        [Language.LATIN]: 'compendium',
        [Language.SPANISH]: 'resumen',
    },
    'subarticle': {
        [Language.LATIN]: 'subarticulus',
        [Language.SPANISH]: 'subartículo',
    },
    'subarticle-': {
        [Language.LATIN]: 'subarticulus-',
        [Language.SPANISH]: 'subartículo-',
    },
    'paragraph': {
        [Language.LATIN]: 'paragraphus',
        [Language.SPANISH]: 'parrafo',
    },
    // This is not merely "paragraph" with a hypen at the end, but also the first part of "paragraph-group"
    'paragraph-': {
        [Language.LATIN]: 'paragraphus-',
        [Language.SPANISH]: 'parrafo-',
    },
    'paragraph-group': {
        [Language.LATIN]: 'paragraphus-classis',
        [Language.SPANISH]: 'parrafo-grupo',
    },
    'final-content': {
        [Language.LATIN]: 'finalis-contentus',
        [Language.SPANISH]: 'contenido-final',
    },
    [Content.PROLOGUE]: {
        [Language.LATIN]: 'prooemium',
        [Language.SPANISH]: 'prologo',
    },
    [Content.PART]: {
        [Language.LATIN]: 'pars',
        [Language.SPANISH]: 'parte',
    },
    [Content.SECTION]: {
        [Language.LATIN]: 'sectio',
        [Language.SPANISH]: 'seccion',
    },
    [Content.CHAPTER]: {
        [Language.LATIN]: 'caput',
        [Language.SPANISH]: 'capitulo',
    },
    [Content.CHAPTER_SECTION]: {
        [Language.LATIN]: 'caput-sectio',
        [Language.SPANISH]: 'capitulo-seccion',
    },
    [Content.ARTICLE]: {
        [Language.LATIN]: 'articulus',
        [Language.SPANISH]: 'articulo',
    },
    [Content.ARTICLE_PARAGRAPH]: {
        [Language.LATIN]: 'articulus-paragraphus',
        [Language.SPANISH]: 'articulo-parrafo',
    },
    [Content.SUB_ARTICLE]: {
        [Language.LATIN]: 'subarticulus',
        [Language.SPANISH]: 'subartículo',
    },
    [Content.IN_BRIEF]: {
        [Language.LATIN]: 'compendium',
        [Language.SPANISH]: 'resumen',
    },
    [Content.PARAGRAPH_GROUP]: {
        [Language.LATIN]: 'paragraphus-classis',
        [Language.SPANISH]: 'parrafo-grupo',
    },
    [Content.PARAGRAPH]: {
        [Language.LATIN]: 'paragraphus',
        [Language.SPANISH]: 'parrafo',
    },
    // During development, it is acceptable to use English for the following `Content` values
    [Content.GENERIC_CONTENT_CONTAINER]: {
        [Language.LATIN]: Content.GENERIC_CONTENT_CONTAINER,
        [Language.SPANISH]: Content.GENERIC_CONTENT_CONTAINER,
    },
    [Content.BLOCK_QUOTE]: {
        [Language.LATIN]: Content.BLOCK_QUOTE,
        [Language.SPANISH]: Content.BLOCK_QUOTE,
    },
    [Content.PARAGRAPH_SUB_ITEM_CONTAINER]: {
        [Language.LATIN]: Content.PARAGRAPH_SUB_ITEM_CONTAINER,
        [Language.SPANISH]: Content.PARAGRAPH_SUB_ITEM_CONTAINER,
    },
    [Content.PARAGRAPH_SUB_ITEM]: {
        [Language.LATIN]: Content.PARAGRAPH_SUB_ITEM,
        [Language.SPANISH]: Content.PARAGRAPH_SUB_ITEM,
    },
    [Content.TEXT_BLOCK]: {
        [Language.LATIN]: Content.TEXT_BLOCK,
        [Language.SPANISH]: Content.TEXT_BLOCK,
    },
    [Content.TEXT_HEADING]: {
        [Language.LATIN]: Content.TEXT_HEADING,
        [Language.SPANISH]: Content.TEXT_HEADING,
    },
    [Content.TEXT_WRAPPER]: {
        [Language.LATIN]: Content.TEXT_WRAPPER,
        [Language.SPANISH]: Content.TEXT_WRAPPER,
    },
    [Content.TEXT]: {
        [Language.LATIN]: Content.TEXT,
        [Language.SPANISH]: Content.TEXT,
    },
    [Content.CREED]: {
        [Language.LATIN]: Content.CREED,
        [Language.SPANISH]: Content.CREED,
    },
    [Content.TEN_COMMANDMENTS]: {
        [Language.LATIN]: Content.TEN_COMMANDMENTS,
        [Language.SPANISH]: Content.TEN_COMMANDMENTS,
    },
    'generic-content-container': {
        [Language.LATIN]: 'generic-content-container',
        [Language.SPANISH]: 'generic-content-container',
    },
    'block-quote': {
        [Language.LATIN]: 'block-quote',
        [Language.SPANISH]: 'block-quote',
    },
    'paragraph-sub-item-container': {
        [Language.LATIN]: 'paragraph-sub-item-container',
        [Language.SPANISH]: 'paragraph-sub-item-container',
    },
    'paragraph-sub-item': {
        [Language.LATIN]: 'paragraph-sub-item',
        [Language.SPANISH]: 'paragraph-sub-item',
    },
    'text-block': {
        [Language.LATIN]: 'text-block',
        [Language.SPANISH]: 'text-block',
    },
    'text-heading': {
        [Language.LATIN]: 'text-heading',
        [Language.SPANISH]: 'text-heading',
    },
    'text-wrapper': {
        [Language.LATIN]: 'text-wrapper',
        [Language.SPANISH]: 'text-wrapper',
    },
    'text': {
        [Language.LATIN]: 'text',
        [Language.SPANISH]: 'text',
    },
    'creed': {
        [Language.LATIN]: 'creed',
        [Language.SPANISH]: 'creed',
    },
    'ten-commandments': {
        [Language.LATIN]: 'ten-commandments',
        [Language.SPANISH]: 'ten-commandments',
    },
    // (end of section where English use is acceptable during development)
};
