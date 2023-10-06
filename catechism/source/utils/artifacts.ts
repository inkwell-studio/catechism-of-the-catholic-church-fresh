import {
    Language,
    ParagraphNumberContentMap,
    ParagraphNumberUrlMap,
    PathIdContentMap,
    SemanticPathPathIdMap,
    TableOfContentsType,
} from '../../source/types/types.ts';

export function getContentMap(language: Language): Promise<PathIdContentMap> {
    return getArtifact('renderable-path-id_to_content', language);
}

export function getRenderablePathMap(language: Language): Promise<SemanticPathPathIdMap> {
    return getArtifact('semantic-path_to_renderable-path-id', language);
}

export function getParagraphNumberContentMap(language: Language): Promise<ParagraphNumberContentMap> {
    return getArtifact('paragraph-number_to_content', language);
}

export function getParagraphNumberUrlMap(language: Language): Promise<ParagraphNumberUrlMap> {
    return getArtifact('paragraph-number_to_url', language);
}

export function getTableOfContents(language: Language): Promise<TableOfContentsType> {
    return getArtifact('table-of-contents', language);
}

// deno-lint-ignore no-explicit-any
async function getArtifact(filenamePrefix: string, language: Language): Promise<any> {
    const filepath = `./catechism/artifacts/${filenamePrefix}-${language}.json`;

    try {
        const artifact = await Deno.readTextFile(filepath);
        return JSON.parse(artifact);
    } catch (error) {
        throw new Error(`Failed to load artifact: ${filepath}`, error);
    }
}
