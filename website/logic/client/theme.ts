import { effect, signal } from '@preact/signals';
import { IS_BROWSER } from '$fresh/runtime.ts';

import { ThemeEnum } from './theme-enum.ts';

//#region top-level variables and functionality
// By default, Tailwind looks for the 'dark' class when using the `class` strategy for dark mode (this is set in tailwind.config.ts)
const DARK_MODE_CLASS = 'dark';
const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)';
const LOCAL_STORAGE_KEY = 'theme';

export const theme = signal<ThemeEnum>(getValue());

if (IS_BROWSER) {
    watchForSystemChanges();
}
//#endregion

//#region auxillary functions
function getValue(): ThemeEnum {
    if (IS_BROWSER) {
        return (localStorage.getItem(LOCAL_STORAGE_KEY) ?? ThemeEnum.SYSTEM) as ThemeEnum;
    } else {
        return ThemeEnum.SYSTEM;
    }
}

function watchForSystemChanges(): void {
    const mediaQueryList = globalThis.matchMedia(DARK_MODE_MEDIA_QUERY);
    mediaQueryList.onchange = (event) => {
        if (ThemeEnum.SYSTEM === theme.value) {
            updateTailwindClass(event.matches);
        }
    };
}

function isDarkModeEnabled(themeValue: ThemeEnum): boolean {
    if (ThemeEnum.SYSTEM === themeValue) {
        return IS_BROWSER ? globalThis.matchMedia(DARK_MODE_MEDIA_QUERY).matches : false;
    } else {
        return ThemeEnum.DARK === themeValue;
    }
}

function onThemeSelection(themeValue: ThemeEnum): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, themeValue);

    const darkModeEnabled = isDarkModeEnabled(themeValue);
    updateTailwindClass(darkModeEnabled);
}

function updateTailwindClass(darkModeEnabled: boolean): void {
    if (darkModeEnabled) {
        document.documentElement.classList.add(DARK_MODE_CLASS);
    } else {
        document.documentElement.classList.remove(DARK_MODE_CLASS);

        /*
        Remove the `class` attribute if it is empty to prevent the `class` attribute
        being present without a value, which is invalid HTML (i.e. `<html class>`)
        */
        if (document.documentElement.classList.length === 0) {
            document.documentElement.removeAttribute('class');
        }
    }
}

effect(() => {
    if (IS_BROWSER) {
        onThemeSelection(theme.value);
    }
});
//#endregion
