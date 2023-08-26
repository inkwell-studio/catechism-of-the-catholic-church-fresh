import Catechism from './catechism.json' assert { type: 'json' };

import { assertNotMatch, assertStrictEquals } from '$deno/testing/asserts.ts';

import { getText } from './test-utils.ts';
import { CatechismStructure, PathID } from '../source/types/types.ts';

//#region setup
const pathIDsAndText = getText(Catechism as CatechismStructure);
//#endregion

//#region helpers
function testLines(func: (textParam: string, pathIDParam: PathID) => void): void {
    for (const { pathID, text } of pathIDsAndText) {
        func(text, pathID);
    }
}

function errorMessage(pathID: PathID, message: string): string {
    return `[${pathID}] ${message}`;
}
//#endregion

//#region tests
console.log('\nEnglish text fragments ...');
Deno.test('"LORD" is spelled as "Lord" with small-capital formatting markings', () => {
    // TODO: Implement
});

Deno.test('do not contain any British English spellings ("ou")', () => {
    // Fail if any words are found containg "ou" unless they are found in the `allowedWords` list
    const ouFalsePositives = [
        'about',
        'bound',
        'country',
        'group',
        'mountain',
        'mouth',
        'thoroughly',
        'throughout',
        'yourselves',
    ];

    const regex = /\b[a-zA-Z]+ou[a-zA-Z]+\b/;
    testLines((line, pathID) => {
        const ouPotentials = line.toLowerCase().match(regex);

        if (ouPotentials) {
            const matches = ouPotentials.filter((word) => !ouFalsePositives.includes(word.toLowerCase()));
            assertStrictEquals(matches.length, 0, errorMessage(pathID, 'contains a British spelling: ' + matches[0]));
        }
    });
});

Deno.test('do not contain any British English spellings (whole words)', () => {
    const alternateSpellings = [
        ['fulfil', 'fulfill'],
        ['fulfils', 'fulfills'],
        ['fulfilment', 'fulfillment'],
    ];

    testLines((line, pathID) => {
        alternateSpellings.forEach((alternate) => {
            const britishSpelling = alternate[0];
            const regex = new RegExp('\\b' + britishSpelling + '\\b');
            assertNotMatch(
                line.toLowerCase(),
                regex,
                errorMessage(pathID, `uses the British spelling ${britishSpelling} instead of ${alternate[1]}`),
            );
        });
    });
});

Deno.test('closing single-quotes are preceded by the proper puncuation', () => {
    const regex = /[^…\.,!]’/;
    testLines((line, pathID) =>
        assertNotMatch(
            line,
            regex,
            errorMessage(pathID, 'closing single-quote preceded by a character other than a period or ellipsis'),
        )
    );
});

Deno.test('closing double-quotes are preceded by the proper punctuation', () => {
    const exceptions: Array<PathID> = [];

    const regex = /[^…\.,!]”/;
    testLines((line, pathID) => {
        if (!exceptions.includes(pathID)) {
            assertNotMatch(
                line,
                regex,
                errorMessage(pathID, 'closing double-quote preceded by a character other than a period or ellipsis'),
            );
        }
    });
});

Deno.test('closing single-quotes are not followed by by punctuation', () => {
    const regex = /’[…\.,!]/;
    testLines((line, pathID) =>
        assertNotMatch(line, regex, errorMessage(pathID, 'closing single-quote followed by a period or ellipsis'))
    );
});

Deno.test('closing double-quotes are not followed by by punctuation', () => {
    const regex = /”[…\.,!]/;
    testLines((line, pathID) =>
        assertNotMatch(line, regex, errorMessage(pathID, 'closing double-quote followed by a period or ellipsis'))
    );
});
//#endregion
