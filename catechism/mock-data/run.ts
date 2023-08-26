import { CatechismStructure } from '../source/types/catechism-structure.ts';
import { buildMockData } from './build/build.ts';

const catechism = buildMockData();
writeToDisk(catechism);

function writeToDisk(catechism: CatechismStructure): void {
    const json = JSON.stringify(catechism, undefined, '  ');
    Deno.writeTextFileSync('catechism/content/catechism.json', json + '\n');
}
