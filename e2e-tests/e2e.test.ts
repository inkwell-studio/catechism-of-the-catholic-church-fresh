import { assert, assertStrictEquals } from '$deno/testing/asserts.ts';
import { createHandler } from '$fresh/server.ts';
import { getSupportedLanguages } from '../catechism/source/utils/language.ts';
import manifest from '../fresh.gen.ts';

const baseUrl = 'http://localhost:8000';

//#region tests
Deno.test('website: miscellaneous', async (test) => {
    const handler = await createHandler(manifest);

    function get(url = ''): Promise<Response> {
        url = url ? `${baseUrl}/${url}` : baseUrl;
        return handler(new Request(url));
    }

    await test.step('the root page is accessible', async () => {
        const r = await get('');
        assertStrictEquals(r.status, 200);
    });

    await test.step('`Content-Language` and `lang` are correct', async (t) => {
        for (const [languageKey, language] of getSupportedLanguages()) {
            await t.step(`${languageKey}`, async () => {
                const r = await get(language);
                assertStrictEquals(r.status, 200);
            });
        }
    });

    await test.step('unsupported valid language codes are recognized', async () => {
        // Force the language to be English for the next error page
        await get('en');

        const r = await get('fr');
        assertStrictEquals(r.status, 200);
        await assertContent(r, 'Unsupported language: ');
    });

    await test.step('invalid routes: 404 page', async () => {
        const r = await get('en/aaaaaaaaaaaaaaaaaaaaaaa');
        assert404(r);
    });

    await test.step('can navigate to the prologue', async () => {
        const r = await get('en/prologue');
        assertStrictEquals(r.status, 200);
    });

    await test.step('/{paragraph-number} redirects to a SemanticPath URL', async () => {
        const r = await get('1');
        assertStrictEquals(r.status, 307);
        assert(r.headers.get('location')?.includes('/prologue#1'));
    });

    await test.step('/en/{paragraph-number} redirects to a SemanticPath URL', async () => {
        const r = await get('en/1');
        assertStrictEquals(r.status, 307);
        assert(r.headers.get('location')?.includes('/en/prologue#1'));
    });

    await test.step('invalid routes (negative paragraph number): 404 page', async () => {
        const r = await get('-1');
        assert404(r);
    });

    await test.step('invalid routes (excessive paragraph number): 404 page', async () => {
        const r = await get('99999');
        assert404(r);
    });
});
//#endregion

//#region helpers
async function assertContent(response: Response, content: string): Promise<void> {
    const html = await response.text();
    assert(html.includes(content), `Content not included: ${content}`);
}

async function assert404(response: Response): Promise<void> {
    assertStrictEquals(response.status, 404);
    await assertContent(response, 'Unknown page');
}
//#endregion
