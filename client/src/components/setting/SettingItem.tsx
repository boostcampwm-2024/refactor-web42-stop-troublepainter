import { memo, useCallback } from 'react';
import { RoomSettings } from '@troublepainter/core';
import Dropdown from '@/components/ui/Dropdown';
import { SHORTCUT_KEYS } from '@/constants/shortcutKeys';

interface SettingItemProps {
  label: string;
  settingKey: keyof RoomSettings;
  value?: number;
  options: number[];
  onSettingChange: (key: keyof RoomSettings, value: string) => void;
  isHost: boolean;
  shortcutKey: keyof typeof SHORTCUT_KEYS;
}

export const SettingItem = memo(
  ({ label, settingKey, value, options, onSettingChange, isHost, shortcutKey }: SettingItemProps) => {
    const handleChange = useCallback(
      (value: string) => {
        onSettingChange(settingKey, value);
      },
      [settingKey, onSettingChange],
    );

    return (
      <div className="flex w-full max-w-80 items-center justify-between lg:max-w-[80%]">
        <span>{label}</span>
        {!isHost ? (
          <span>{value || ''}</span>
        ) : (
          <Dropdown
            shortcutKey={shortcutKey}
            options={options.map(String)}
            selectedValue={value?.toString() || ''}
            handleChange={handleChange}
            className="h-7 w-[30%] min-w-[4.25rem] text-xl sm:min-w-28 lg:h-auto lg:text-2xl"
          />
        )}
      </div>
    );
  },
);
