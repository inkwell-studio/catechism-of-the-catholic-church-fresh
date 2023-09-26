import { Language, NumberOrNumberRange, Paragraph } from '../catechism/source/types/types.ts';

export async function getParagraphs(paragraphNumbers: NumberOrNumberRange, language: Language): Promise<Array<Paragraph>> {
    const response = await fetch(`${location.origin}/api/${language}/paragraph/${paragraphNumbers}`);
    return await response.json();
}
