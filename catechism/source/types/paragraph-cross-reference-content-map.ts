import { NumberOrNumberRange } from './number-or-number-range.ts';
import { Paragraph } from './paragraph.ts';

// A map of cross-reference identifiers to their content
export type ParagraphCrossReferenceContentMap = Record<NumberOrNumberRange, Array<Paragraph>>;
