import { signal } from '@preact/signals';

const open = signal<boolean>(false);

export default function Menu() {
    return (
        <>
            <div onClick={toggle} class='block sm:hidden'>[M]</div>
            <div onClick={toggle} class={`hidden sm:block ${open.value ? 'bg-green-400' : 'bg-blue-400'}`}>
                [ Menu ]
            </div>
        </>
    );
}

function toggle(): void {
    open.value = !open.value;
}
