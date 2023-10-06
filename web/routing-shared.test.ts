import { assertStrictEquals } from '$deno/testing/asserts.ts';

import { getUrlFragment } from './routing-shared.ts';
import { Language, SemanticPath } from '../catechism/source/types/types.ts';

console.log('\nrouting utils (shared) ...');

//#region getUrlFragment()
console.log('URL logic ...');

Deno.test('getUrlFragment(): high-level non-first-child content', () => {
    [
        'prologue',
        'part-1',
        'part-1/section-11',
        'part-1/section-11/chapter-11',
        'part-1/section-11/chapter-11/article-11',
        'part-1/section-11/chapter-11/article-11/article-paragraph-11',
    ].forEach((testCase) => fragmentUndefinedTest(testCase, 'both'));
});

Deno.test('getUrlFragment(): high-level first-child content', () => {
    const testCases: Array<[SemanticPath, string | undefined]> = [
        [
            'part-1',
            undefined,
        ],
        [
            'part-1/section-1',
            'section-1',
        ],
        [
            'part-1/section-1/chapter-1',
            'section-1/chapter-1',
        ],
        [
            'part-1/section-1/chapter-1/article-1',
            'section-1/chapter-1/article-1',
        ],
        [
            'part-1/section-1/chapter-1/article-1/article-paragraph-1',
            'section-1/chapter-1/article-1/article-paragraph-1',
        ],
        [
            'part-1/section-1/chapter-1/article-1/article-paragraph-1/subarticle-8',
            'section-1/chapter-1/article-1/article-paragraph-1/subarticle-8',
        ],
        [
            'part-1/section-1/chapter-1/article-8/article-paragraph-1',
            'article-paragraph-1',
        ],
        [
            'part-1/section-1/chapter-8/article-1/article-paragraph-1',
            'article-1/article-paragraph-1',
        ],
        [
            'part-1/section-8/chapter-1/article-1/article-paragraph-1',
            'chapter-1/article-1/article-paragraph-1',
        ],
    ];

    testCases.forEach((testCase) => fragmentTest(testCase[0], testCase[1], 'both'));
});

Deno.test('getUrlFragment(): Prologue with low-level content', () => {
    [
        [
            'prologue/subarticle-1',
            'subarticle-1',
        ],
        [
            'prologue/subarticle-1/paragraph-group-1',
            'subarticle-1/paragraph-group-1',
        ],
        [
            'prologue/subarticle-1/paragraph-group-1/paragraph-2',
            '2',
        ],
        [
            'prologue/subarticle-1/paragraph-2',
            '2',
        ],
    ].forEach((testCase) => fragmentTest(testCase[0], testCase[1], 'both'));
});

Deno.test('getUrlFragment(): initial Article Paragraphs', () => {
    [
        [
            'part-1/section-3/chapter-2/article-4/article-paragraph-1',
            'article-paragraph-1',
        ],
        [
            'part-1/section-3/chapter-2/article-4/article-paragraph-1/paragraph-group-5',
            'article-paragraph-1/paragraph-group-5',
        ],
        [
            'part-1/section-3/chapter-2/article-4/article-paragraph-1/paragraph-group-5/paragraph-702',
            '702',
        ],
        [
            'part-1/section-3/chapter-2/article-4/article-paragraph-1/in-brief',
            'article-paragraph-1/in-brief',
        ],
    ].forEach((testCase) => fragmentTest(testCase[0], testCase[1], 'both'));
});

Deno.test('getUrlFragment(): returns undefined for subsequent Article Paragraphs', () => {
    [
        'part-1/section-3/chapter-2/article-4/article-paragraph-2',
        'part-1/section-3/chapter-2/article-4/article-paragraph-12',
    ].forEach((testCase) => fragmentUndefinedTest(testCase, 'both'));
});

Deno.test('getUrlFragment(): acknowledges final content appropriately', () => {
    const input = 'part-1/section-3/chapter-2/article-4/final-content';
    const expectedFragment = 'final-content';
    fragmentTest(input, expectedFragment, true);
});

Deno.test('getUrlFragment(): ignores final content appropriately', () => {
    const input = 'part-1/section-3/chapter-2/article-4/final-content';
    fragmentUndefinedTest(input, false);
});

Deno.test('getUrlFragment(): Subarticles', () => {
    [
        [
            'part-1/section-3/chapter-2/article-4/subarticle-7/paragraph-group-5',
            'subarticle-7/paragraph-group-5',
        ],
        [
            'part-1/section-3/chapter-2/article-4/subarticle-7/paragraph-group-5/paragraph-702',
            '702',
        ],
    ].forEach((testCase) => fragmentTest(testCase[0], testCase[1], true));
});

Deno.test('getUrlFragment(): Paragraph Groups', () => {
    [
        [
            'part-1/section-3/chapter-2/article-4/paragraph-group-5',
            'paragraph-group-5',
        ],
        [
            'part-1/section-3/chapter-2/article-4/paragraph-group-5/paragraph-702',
            '702',
        ],
    ].forEach((testCase) => fragmentTest(testCase[0], testCase[1], true));
});

Deno.test('getUrlFragment(): Paragraphs', () => {
    [
        [
            'part-1/section-3/chapter-2/article-4/paragraph-702',
            '702',
        ],
    ].forEach((testCase) => fragmentTest(testCase[0], testCase[1], true));
});

Deno.test('getUrlFragment(): In Brief', () => {
    [
        'part-1/section-3/chapter-2/article-4/in-brief',
        'part-1/section-3/chapter-2/article-4/article-paragraph-2/in-brief',
        'part-1/section-3/chapter-2/in-brief',
    ].forEach((testCase) => fragmentTest(testCase, 'in-brief', true));
});

function fragmentTest(
    semanticPath: SemanticPath,
    expectedFragment: string | undefined,
    acknowledgeFinalContent: boolean | 'both',
): void {
    if ('both' === acknowledgeFinalContent) {
        test(semanticPath, expectedFragment, true);
        test(semanticPath, expectedFragment, false);
    } else {
        test(semanticPath, expectedFragment, acknowledgeFinalContent);
    }

    function test(path: SemanticPath, expectedResult: string | undefined, acknowledgeFinalContentFlag: boolean): void {
        const fragment = getUrlFragment(path, acknowledgeFinalContentFlag, Language.ENGLISH);
        assertStrictEquals(
            fragment.fragment,
            expectedResult,
            `\nincorrect fragment determination:\n\n\tinput:\t\t${path}\n\n\tresults:\n\texpected\t${expectedResult}\n\tactual\t\t${fragment}\n`,
        );
    }
}

function fragmentUndefinedTest(semanticPath: SemanticPath, acknowledgeFinalContent: boolean | 'both'): void {
    if ('both' === acknowledgeFinalContent) {
        fragmentTest(semanticPath, undefined, true);
        fragmentTest(semanticPath, undefined, false);
    } else {
        fragmentTest(semanticPath, undefined, acknowledgeFinalContent);
    }
}
//#endregion
