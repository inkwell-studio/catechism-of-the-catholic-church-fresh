import { JSX } from 'preact';

import { NavigationMenu } from '../(_components)/navigation-menu.tsx';
import Search from '../(_islands)/search.tsx';
import TrailHierarchical from '../(_islands)/trail-hierarchical.tsx';
import TrailHistorical from '../(_islands)/trail-historical.tsx';

export function ActionBar(): JSX.Element {
    return (
        <div class='flex justify-center gap-8 bg-tan-100 border'>
            {/* <TrailHierarchical></TrailHierarchical> */}
            {/* <TrailHistorical></TrailHistorical> */}
            {/* <Search></Search> */}
            <NavigationMenu></NavigationMenu>
        </div>
    );
}
