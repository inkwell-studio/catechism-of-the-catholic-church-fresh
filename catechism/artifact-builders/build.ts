import { build as buildContentMap } from './path-id-to-content-map.ts';
import { build as buildParagraphContentMap } from './paragraph-number-to-content-map.ts';
import { build as buildParagraphUrlMap } from './paragraph-number-to-url-map.ts';
import { build as buildSemanticMap } from './semantic-path-to-renderable-path-id-map.ts';
import { build as buildTableOfContents } from './table-of-contents.ts';
import {
    Language,
    ParagraphNumberContentMap,
    ParagraphNumberUrlMap,
} from '../source/types/types.ts';
import { getCatechism } from '../source/utils/content.ts';
import { getSupportedLanguages } from '../source/utils/language.ts';
import {
    CatechismStructure,
    PathIdContentMap,
    SemanticPathPathIdMap,
    TableOfContentsType,
} from '../source/types/types.ts';

getSupportedLanguages().forEach(([languageKey, language]) => {
    getCatechism(language)
        .then((catechism) => buildArtifacts(catechism))
        .catch((error) => console.error(`Could not retrieve the Catechism JSON for ${languageKey}`, error));
});

function buildArtifacts(catechism: CatechismStructure): void {
    console.log(`\nBuilding artifacts (${catechism.language}) ...`);

    console.log('\ttable of contents ...');
    const tableOfContents = buildTableOfContents(catechism);
    writeJson(tableOfContents, 'table-of-contents', catechism.language);

    console.log('\tparagraph number to content map ...');
    const paragraphContentMap = buildParagraphContentMap(catechism);
    writeJson(paragraphContentMap, 'paragraph-number_to_content', catechism.language);

    console.log('\tparagraph number to URL map ...');
    const paragraphUrlMap = buildParagraphUrlMap(catechism);
    writeJson(paragraphUrlMap, 'paragraph-number_to_url', catechism.language);

    console.log('\tSemanticPath to renderable PathID map ...');
    const renderablePathMap = buildSemanticMap(tableOfContents);
    writeJson(renderablePathMap, 'semantic-path_to_renderable-path-id', catechism.language);

    console.log('\trenderable PathID to content map ...');
    const contentMap = buildContentMap(renderablePathMap, catechism);
    writeJson(contentMap, 'renderable-path-id_to_content', catechism.language);
}

function writeJson(
    object:
        | ParagraphNumberContentMap
        | ParagraphNumberUrlMap
        | PathIdContentMap
        | SemanticPathPathIdMap
        | TableOfContentsType,
    filename: string,
    language: Language,
): void {
    Deno.writeTextFileSync(
        `catechism/artifacts/${filename}-${language}.json`,
        // TODO: For production, write the files without formatting
        JSON.stringify(object, undefined, '  ') + '\n',
    );
}
