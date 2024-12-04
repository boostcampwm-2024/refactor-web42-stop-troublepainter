import { useCallback, useEffect } from 'react';
import { SHORTCUT_KEYS } from '@/constants/shortcutKeys';

interface ShortcutConfig {
  key: keyof typeof SHORTCUT_KEYS | null;
  action: () => void;
  disabled?: boolean;
}

export const useShortcuts = (configs: ShortcutConfig[]) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // input 요소에서는 단축키 비활성화
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      configs.forEach(({ key, action, disabled }) => {
        if (!key || disabled) return;

        const shortcut = SHORTCUT_KEYS[key];
        const pressedKey = e.key.toLowerCase();
        const isMainKey = pressedKey === shortcut.key.toLowerCase();
        const isAlternativeKey = shortcut.alternativeKeys?.some((key) => key.toLowerCase() === pressedKey);

        if (isMainKey || isAlternativeKey) {
          e.preventDefault();
          action();
        }
      });
    },
    [configs],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
