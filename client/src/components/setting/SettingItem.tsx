import { memo } from 'react';
import Dropdown from '../ui/Dropdown';

export const SettingItem = memo(
  ({
    label,
    value,
    options,
    onChange,
    isHost,
  }: {
    label: string;
    value?: number;
    options: number[];
    onChange: (value: string) => void;
    isHost: boolean;
  }) => {
    return (
      <div className="flex w-full max-w-80 items-center justify-between lg:max-w-[80%]">
        <span>{label}</span>
        {!isHost ? (
          <span>{value || ''}</span>
        ) : (
          <Dropdown
            options={options.map(String)}
            selectedValue={value?.toString() || ''}
            handleChange={onChange}
            className="h-7 w-[30%] min-w-[4.25rem] text-xl sm:min-w-28 lg:h-auto lg:text-2xl"
          />
        )}
      </div>
    );
  },
);
