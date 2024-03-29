// @ts-ignore
import daisyUiColors from 'daisyui/src/theming/themes';
import { getLocalStorage, setLocalStorage } from './storage';
import { useEffect, useState } from 'react';

const getTheme = () => getLocalStorage('pigeon-theme') || 'autumn';

export const setTheme = (newTheme: string) => {
  setLocalStorage('pigeon-theme', newTheme);
  window.dispatchEvent(new Event('storage'));
  document.querySelector('html')!.setAttribute('data-theme', newTheme);
};

type ThemeColors = {
  'color-scheme': string;
  primary: string;
  secondary: string;
  accent: string;
  'base-100': string;
  'base-200': string;
  'base-300': string;
  neutral: string;
  'neutral-focus': string;
  info: string;
  success: string;
  warning: string;
  error: string;
};

const getThemeColors = (): ThemeColors => (daisyUiColors as any)[`[data-theme=${getTheme() as any}]`];

export const useTheme = () => {
  const lightThemeColors = (daisyUiColors as any)[`[data-theme=autumn]`];
  const [theme, _setTheme] = useState<string>('');
  const [themeColors, setThemeColors] = useState<ThemeColors>(lightThemeColors);

  useEffect(() => {
    // Only access local storage on component mount, else risk undefined
    _setTheme(getTheme());
    setThemeColors(getThemeColors());

    // Check for theme change when local storage is changed
    const onStorage = () => {
      setThemeColors(getThemeColors());
    };

    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return { theme, themeColors };
};
