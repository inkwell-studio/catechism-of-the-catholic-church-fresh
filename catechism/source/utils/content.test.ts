import { assertEquals } from '$deno/testing/asserts.ts';

import { getParagraphNumbers } from './content.ts';
import { NumberOrNumberRange } from '../types/types.ts';

console.log('\nContent logic ...');

Deno.test('getParagraphNumbers()', () => {
    const input: Array<NumberOrNumberRange> = [7, 3, '10-11', 5, '20-23'];
    const expectedOutput = [7, 3, 10, 11, 5, 20, 21, 22, 23];
    const result = getParagraphNumbers(input);
    assertEquals(result, expectedOutput);
});
