import RenderablePathMap from './semantic-path_to_renderable-path-id.json' assert { type: 'json' };

import { assertStrictEquals } from '$deno/testing/asserts.ts';

console.log('\nSemanticPath to renderable PathID map ...');

Deno.test('all SemanticPaths are unique', () => {
    const semanticPaths = Object.keys(RenderablePathMap);
    const numUniqueSemanticPaths = new Set(semanticPaths).size;

    const numSemanticPaths = semanticPaths.length;
    assertStrictEquals(
        numSemanticPaths,
        numUniqueSemanticPaths,
        `${numSemanticPaths - numUniqueSemanticPaths} duplicate SemanticPaths exist`,
    );
});
