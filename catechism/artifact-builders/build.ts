import { build as buildPathMap } from './path-map.ts';
import { build as buildTableOfContents } from './table-of-contents.ts';
import { Catechism } from '../source/catechism.ts';
import { PathMap, TableOfContentsType } from '../source/types/types.ts';

buildArtifacts();

function buildArtifacts(): void {
    console.log('\nBuilding artifacts ...');

    console.log('\ttable-of-contents ...');
    const tableOfContents = buildTableOfContents(Catechism);
    writeJson(tableOfContents, 'table-of-contents');

    console.log('\tsemantic-path to path-id map ...');
    const pathMap = buildPathMap(tableOfContents);
    writeJson(pathMap, 'semantic-path-to-path-id');
}

function writeJson(object: PathMap | TableOfContentsType, filename: string): void {
    Deno.writeTextFileSync(
        `catechism/artifacts/${filename}.json`,
        JSON.stringify(object, undefined, '    ') + '\n',
    );
}
