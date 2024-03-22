import { JSX } from 'preact';

import { Actions } from '../../logic/shared/state.ts';
import { NumberOrNumberRange } from '../../../catechism/source/types/types.ts';

export default function CrossReferenceLink(props: { reference: NumberOrNumberRange }): JSX.Element {
    return (
        <button onClick={() => Actions.crossReference.select(props.reference)}>
            {props.reference.toString()}
        </button>
    );
}
