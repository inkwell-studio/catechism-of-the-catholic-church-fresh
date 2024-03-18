import { Language, NumberOrNumberRange, Paragraph } from '../../../catechism/source/types/types.ts';

const api = 'api';

export async function getParagraphs(
    paragraphNumbers: NumberOrNumberRange,
    language: Language,
): Promise<Array<Paragraph>> {
    // Convert en dashes to hyphens
    const paragraphNumbersWithHyphens = `${paragraphNumbers}`.replaceAll('–', '-');
    const response = await fetch(`${location.origin}/${api}/${language}/paragraph/${paragraphNumbersWithHyphens}`);
    return await response.json();
}
