// deno-lint-ignore-file fresh-server-event-handlers
import { useSignal } from '@preact/signals';

import { Paragraph } from "../../catechism/source/types/types.ts";

export default function ParagraphReference(props: { paragraph: Paragraph }) {
    const open = useSignal<boolean>(false);

    return (
        <>
            <div onClick={() => open.value = !open.value} class='block sm:hidden'>[M]</div>
            <div onClick={() => open.value = !open.value} class={`hidden sm:block ${open.value ? 'bg-tan-50' : 'bg-tan-100'}`}>

            </div>
        </>
    );
}
