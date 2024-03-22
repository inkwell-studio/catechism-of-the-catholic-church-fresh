import { JSX } from 'preact';

export const ContentStartID = 'content-start';

/**
 * This component provides the element that the `AutoScoller` component uses to scroll to the "top" of a page
 */
export function ContentStart(): JSX.Element {
    return <div id={ContentStartID} class='h-0 w-0'></div>;
}
