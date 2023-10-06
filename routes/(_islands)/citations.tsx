// deno-lint-ignore-file fresh-server-event-handlers
import { JSX } from 'preact';

export default function Citations(): JSX.Element {
    return (
        <div onClick={() => console.log('remove me when implemented')} class='bg-red-50 p-8 border text-center'>
            Citations
        </div>
    );
}
