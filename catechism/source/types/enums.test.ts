import { assertStrictEquals } from '$deno/testing/asserts.ts';
import { BibleBook, Content, OtherSourceEnum, ReferenceEnum } from './types.ts';

console.log('\nEnums ...');
Deno.test('have unique values', () => {
    const allEnumValues = [
        ...Object.values(BibleBook),
        ...Object.values(Content),
        ...Object.values(OtherSourceEnum),
        ...Object.values(ReferenceEnum),
    ];

    const uniqueEnumValues = new Set(allEnumValues);

    assertStrictEquals(allEnumValues.length, uniqueEnumValues.size, 'Duplicate enum values exist');
});
