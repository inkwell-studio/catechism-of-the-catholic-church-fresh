import { assertEquals, assertStrictEquals } from '$deno/testing/asserts.ts';

import { getParagraphNumbers } from './content.ts';

console.log('\nContent logic ...');

Deno.test('getParagraphNumbers(): number', () => {
    assertStrictEquals(getParagraphNumbers(7), 7);
});

Deno.test('getParagraphNumbers(): number range (no gap)', () => {
    assertEquals(getParagraphNumbers('10-11'), [10, 11]);
});

Deno.test('getParagraphNumbers(): number range (with gap)', () => {
    assertEquals(getParagraphNumbers('10-12'), [10, 11, 12]);
});
