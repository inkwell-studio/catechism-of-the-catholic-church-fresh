import { getTopIndex, PathID } from './path-id.ts';
import { getPartialChildPathID } from './types.ts';
import { assertStrictEquals } from '../../../dependencies.ts';

console.log('\nPathId logic ...');
Deno.test('getTopIndex() handles positive integers', () => {
    const tests: Array<[PathID, number]> = [
        ['0', 0],
        ['1', 1],
        ['100', 100],
    ];

    tests.forEach(([input, expectedResult]) => {
        const result = getTopIndex(input);
        assertStrictEquals(result, expectedResult, `in: ${input}, expected: ${expectedResult}, received: ${result}`);
    });
});

Deno.test('getTopIndex() returns 0 for invalid PathIDs', () => {
    const tests = [
        null,
        undefined,
        '',
        '-0',
        '-1',
        '-100',
        '1.2',
        1,
    ];

    tests.forEach((input) => {
        const result = getTopIndex(input as unknown as PathID);
        assertStrictEquals(result, 0, `in: ${input}, out: ${result}`);
    });
});

Deno.test('getPartialChildPathID() returns the child portion of a PathID', () => {
    const tests: Array<[PathID, PathID]> = [
        ['1-2', '2'],
        ['2-3-1', '3-1'],
        ['789-123-456-904', '123-456-904'],
    ];

    tests.forEach(([input, expectedResult]) => {
        const result = getPartialChildPathID(input);
        assertStrictEquals(result, expectedResult, `in: ${input}, expected: ${expectedResult}, received ${result}`);
    });
});

Deno.test('getPartialChildPathID() returns null for a PathID with no children', () => {
    const input = '23';
    const result = getPartialChildPathID(input);
    assertStrictEquals(result, null, `in: ${input}, expected: null, received ${result}`);
});
