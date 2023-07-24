import { BibleBook, Content, OtherSourceEnum, ReferenceEnum, TextKey } from './types.ts';
import { assertStrictEquals } from '../../../dependencies.ts';

console.log('\nEnums ...');
Deno.test('have unique values', () => {
    const allEnumValues = [
        ...Object.values(BibleBook),
        ...Object.values(Content),
        ...Object.values(OtherSourceEnum),
        ...Object.values(ReferenceEnum),
        ...Object.values(TextKey),
    ];

    const uniqueEnumValues = new Set(allEnumValues);

    assertStrictEquals(allEnumValues.length, uniqueEnumValues.size, 'Duplicate enum values exist');
});
