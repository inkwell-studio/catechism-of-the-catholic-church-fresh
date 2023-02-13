import { JSX } from 'preact';

export type ComponentChildren = ComponentChild | Array<ComponentChild>;

type ComponentChild = JSX.Element | string;
