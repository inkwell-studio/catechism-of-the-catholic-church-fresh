import { JSX } from 'preact';

import Search from '../(_islands)/search.tsx';
import Menu from '../(_islands)/menu.tsx';
import TrailHierarchical from '../(_islands)/trail-hierarchical.tsx';
import TrailHistorical from '../(_islands)/trail-historical.tsx';

export function ActionBar(): JSX.Element {
    return (
        <div class='flex justify-center gap-8 bg-tan-100 border py-4'>
            <TrailHierarchical></TrailHierarchical>
            <TrailHistorical></TrailHistorical>
            <Search></Search>
            <Menu></Menu>
        </div>
    );
}
