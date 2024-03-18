import { JSX } from 'preact';

export default function Search(): JSX.Element {
    return (
        <>
            <div class='block sm:hidden'>(S)</div>
            <div class='hidden sm:block'>( Search )</div>
        </>
    );
}
