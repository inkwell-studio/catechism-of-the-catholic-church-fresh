import { CatechismStructure, Content, ContentBase, PathID, Text } from '../source/types/types.ts';
import { getAllChildContent, getAllContent } from '../source/utils/content.ts';

type TextTuple = {
    pathID: PathID;
    text: string;
};

export type CatechismText = Array<TextTuple>;

export function getText(catechism: CatechismStructure): CatechismText {
    const allContent = getAllContent(catechism);
    return helper([], allContent);

    function helper(textTuples: CatechismText, contentArray: Array<ContentBase>): CatechismText {
        contentArray.forEach((content) => {
            const tuple = getTextTuple(content);
            if (tuple) {
                textTuples.push(tuple);
            }

            const childContent = getAllChildContent(content);
            if (childContent.length > 0) {
                return helper(textTuples, childContent);
            }
        });

        return textTuples;
    }
}

function getTextTuple(content: ContentBase): TextTuple | null {
    if (Content.TEXT === content.contentType) {
        return {
            pathID: content.pathID,
            text: (content as Text).content,
        };
    } else {
        if ('title' in content && typeof content.title === 'string') {
            return {
                pathID: content.pathID,
                text: content.title,
            };
        } else {
            return null;
        }
    }
}
