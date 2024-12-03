import { memo } from 'react';
import { RoomSettings } from '@troublepainter/core';
import { RoomSettingItem } from '@/components/setting/Setting';
import { SettingItem } from '@/components/setting/SettingItem';

interface SettingContentProps {
  settings: RoomSettingItem[];
  values: Partial<RoomSettings>;
  isHost: boolean;
  onSettingChange: (key: keyof RoomSettings, value: string) => void;
}

export const SettingContent = memo(({ settings, values, isHost, onSettingChange }: SettingContentProps) => (
  <div className="flex min-h-[16.125rem] items-center justify-center bg-violet-200 sm:min-h-[18.56rem] sm:rounded-b-xl sm:px-6">
    <div className="flex min-h-[13.8rem] w-full flex-col items-center justify-center gap-4 border-0 border-violet-950 bg-violet-50 p-4 text-xl sm:h-auto sm:rounded-[0.625rem] sm:border-2 lg:gap-6 lg:text-2xl">
      {settings.map(({ label, key, options, shortcutKey }) => (
        <SettingItem
          key={key}
          label={label}
          settingKey={key}
          value={values[key]}
          options={options}
          onSettingChange={onSettingChange}
          isHost={isHost}
          shortcutKey={shortcutKey}
        />
      ))}
    </div>
  </div>
));
