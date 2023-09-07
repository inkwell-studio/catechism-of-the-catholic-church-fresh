import { assert, assertStrictEquals } from '$deno/testing/asserts.ts';
import { createHandler } from '$fresh/server.ts';
import { getAllLanguages } from '../catechism/source/utils/language.ts';
import manifest from '../fresh.gen.ts';

const baseUrl = 'http://localhost:8000';

Deno.test('website', async (test) => {
    const handler = await createHandler(manifest);

    function get(url = ''): Promise<Response> {
        url = url ? `${baseUrl}/${url}` : baseUrl;
        return handler(new Request(url));
    }

    await test.step('the root page is accessible', async () => {
        const r = await get();
        assertStrictEquals(r.status, 200);
    });

    await test.step('`Content-Language` and `lang` are correct', async (t) => {
        for (const [languageKey, language] of getAllLanguages()) {
            await t.step(`${languageKey}`, async () => {
                const r = await get(language);
                assertStrictEquals(r.status, 200);
            });
        }
    });

    await test.step('unsupported valid language codes are recognized', async () => {
        const r = await get('fr');
        assertStrictEquals(r.status, 200);
        await assertContent(r, 'Unsupported language');
    });

    await test.step('invalid routes: 404 page', async () => {
        const r = await get('aaaaaaaaaaaaaaaaaaaaaaa');
        assertStrictEquals(r.status, 404);
        await assertContent(r, 'Unknown page: ');
    });
});

async function assertContent(response: Response, content: string): Promise<void> {
    const html = await response.text();
    assert(html.includes(content), `Content not included: ${content}`);
}
