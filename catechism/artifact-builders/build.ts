import Catechism from '../content/catechism.json' assert { type: 'json' };
import { CatechismStructure } from '../source/types/types.ts';

import { build as buildContentMap } from './path-id-to-content-map.ts';
import { build as buildSemanticMap } from './semantic-path-to-renderable-path-id-map.ts';
import { build as buildTableOfContents } from './table-of-contents.ts';
import { PathIdContentMap, SemanticPathPathIdMap, TableOfContentsType } from '../source/types/types.ts';

buildArtifacts();

function buildArtifacts(): void {
    console.log('\nBuilding artifacts ...');

    console.log('\ttable of contents ...');
    const catechism = Catechism as CatechismStructure;
    const tableOfContents = buildTableOfContents(catechism);
    writeJson(tableOfContents, 'table-of-contents');

    console.log('\tSemanticPath to PathID map ...');
    const renderablePathMap = buildSemanticMap(tableOfContents);
    writeJson(renderablePathMap, 'semantic-path_to_renderable-path-id');

    console.log('\tPathID to renderable PathID map ...');
    const contentMap = buildContentMap(renderablePathMap, catechism);
    writeJson(contentMap, 'renderable-path-id_to_content');
}

function writeJson(object: PathIdContentMap | SemanticPathPathIdMap | TableOfContentsType, filename: string): void {
    Deno.writeTextFileSync(
        `catechism/artifacts/${filename}.json`,
        JSON.stringify(object, undefined, '  ') + '\n',
    );
}
