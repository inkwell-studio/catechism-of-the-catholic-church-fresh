import Search from '../(_islands)/search.tsx';
import Menu from '../(_islands)/menu.tsx';
import TrailHierarchical from '../(_islands)/trail-hierarchical.tsx';
import TrailHistorical from '../(_islands)/trail-historical.tsx';

export function ActionBar() {
    return (
        <div>
            <TrailHierarchical></TrailHierarchical>
            <TrailHistorical></TrailHistorical>
            <Menu></Menu>
            <Search></Search>
        </div>
    );
}
