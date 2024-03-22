import { JSX } from 'preact';

import { Selectors } from '../../logic/shared/state.ts';
import { translate } from '../../logic/shared/translation.ts';

import { getAllLanguages, getNativeLanguageText } from '../../../catechism/source/utils/language.ts';

export function UnsupportedLanguage(props: { languageCode: string }): JSX.Element {
    return (
        <div class='p-12'>
            <div>
                {translate('Unsupported language', Selectors.language.value)}:{' '}
                <span class='font-mono'>{props.languageCode}</span>
            </div>
            <div class='mt-4'>
                <strong class='font-bold'>
                    {translate('Available languages', Selectors.language.value)}:
                </strong>
                <ul class='list-disc mt-2'>
                    {getAllLanguages().map(([code, _language]) => (
                        <li>
                            {getNativeLanguageText(code)}: <span class='font-mono'>{code}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
