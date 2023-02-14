import { state } from '../state/state.ts';

export default function ChangelogTrigger(props: { text: string; classes: string }) {
    return <button onClick={open} class={props.classes}>{props.text}</button>;
}

function open(): void {
    state.value = {
        ...state.value,
        showChangelog: true,
    };
}
