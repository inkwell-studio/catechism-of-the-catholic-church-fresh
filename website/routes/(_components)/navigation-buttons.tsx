import { JSX } from 'preact';

import { Selectors } from '../../logic/shared/state.ts';
import { RenderableNode } from '../../../catechism/source/types/types.ts';

const commonLinkClasses = ' absolute -top-16 h-12 w-12 rounded-full opacity-30 hover:opacity-100 ';

export function NavigationButtons(): JSX.Element {
    const previousNode = Selectors.navigation.previousNode.value;
    const nextNode = Selectors.navigation.nextNode.value;

    return (
        <>
            {Previous(previousNode)}
            {Next(nextNode)}
        </>
    );
}

function Next(node: RenderableNode | null): JSX.Element {
    if (node) {
        return (
            <a href={node.url} class={commonLinkClasses + 'right-4'}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                </svg>
            </a>
        );
    } else {
        return <></>;
    }
}

function Previous(node: RenderableNode | null): JSX.Element {
    if (node) {
        return (
            <a href={node.url} class={commonLinkClasses + 'left-4'}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                </svg>
            </a>
        );
    } else {
        return <></>;
    }
}
