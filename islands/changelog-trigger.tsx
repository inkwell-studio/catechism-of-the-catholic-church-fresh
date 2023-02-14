import { state } from '../state/state.ts';

export default function ChangelogTrigger(props: { text: string }) {
    return (
        <button onClick={open}>
            <strong class='font-bold hover:underline'>
                {props.text}
            </strong>
        </button>
    );
}

function open(): void {
    state.value = {
        ...state.value,
        showChangelog: true,
    };
}
