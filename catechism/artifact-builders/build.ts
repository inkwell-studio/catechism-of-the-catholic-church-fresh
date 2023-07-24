import { build as buildPathMap } from './path-map.ts';
import { build as buildTableOfContents } from './table-of-contents.ts';

buildArtifacts();

function buildArtifacts(): void {
    console.log('\nBuilding artifacts ...');

    console.log('\ttable-of-contents ...');
    const tableOfContents = buildTableOfContents();
    writeJson(tableOfContents, 'table-of-contents');

    console.log('\tsemantic-path to path-id map ...');
    const pathMap = buildPathMap(tableOfContents);
    writeJson(pathMap, 'semantic-path-to-path-id');
}

function writeJson(object: Record<string, unknown>, filename: string): void {
    Deno.writeTextFileSync(
        `catechism/artifacts/${filename}.json`,
        JSON.stringify(object, undefined, '    ') + '\n',
    );
}
