// deno-lint-ignore-file fresh-server-event-handlers
import { JSX } from 'preact';

import { state } from '../../web/state.ts';

export default function ChangelogTrigger(props: { text: string; classes: string }): JSX.Element {
    return <button onClick={open} class={props.classes}>{props.text}</button>;
}

function open(): void {
    state.value = {
        ...state.value,
        showChangelog: true,
    };
}
