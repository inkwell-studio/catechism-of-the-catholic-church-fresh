import { CatechismStructure, ParagraphNumberUrlMap } from '../source/types/types.ts';
import { getAllParagraphs } from '../source/utils/content.ts';
import { getUrl } from '../../website/logic/server/routing.ts';

export function build(catechism: CatechismStructure): ParagraphNumberUrlMap {
    const urlMap: ParagraphNumberUrlMap = {};

    getAllParagraphs(catechism).forEach((p) => urlMap[p.paragraphNumber] = getUrl(catechism.language, p.semanticPath));

    return urlMap;
}
