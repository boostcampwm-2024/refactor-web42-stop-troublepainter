import { HTMLAttributes, useState } from 'react';
import Dropdown from '../ui/Dropdown';
import { SETTING_ITEMS } from '@/constants/setting';
import { SettingOption, SettingKey, SettingValues } from '@/types/setting.types';
import { cn } from '@/utils/cn';

interface SettingProps extends HTMLAttributes<HTMLDivElement> {
  roundCount?: number;
  playerCount?: number;
  timeLimit?: number;
  type: 'host' | 'participant';
}

const Setting = ({ className, roundCount = 4, playerCount = 4, timeLimit = 30, type, ...props }: SettingProps) => {
  const [selectedValues, setSelectedValues] = useState<SettingValues>({
    roundCount,
    playerCount,
    timeLimit,
  });

  const handleChange = (key: SettingKey) => (value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const convertToString = (options: SettingOption[]) =>
    options.map((option) => ({
      ...option,
      value: option.value.toString(),
    }));

  return (
    <section
      className={cn(
        'flex flex-col overflow-hidden border-y-2 border-violet-950 sm:rounded-xl sm:border-x-2',
        className,
      )}
      {...props}
    >
      {/* Setting title */}
      <div className="flex min-h-[3.375rem] w-full items-center justify-center border-b-2 border-violet-950 bg-violet-500 p-3 sm:min-h-16">
        <h2 className="text-2xl text-white text-stroke-md sm:translate-y-1 sm:text-4xl">Setting</h2>
      </div>

      {/* Setting content */}
      <div className="flex min-h-[16.125rem] items-center justify-center bg-violet-200 sm:min-h-[18.56rem] sm:px-6">
        <div className="flex min-h-[13.8rem] w-full flex-col items-center justify-center gap-6 border-y-2 border-violet-950 bg-violet-50 p-4 text-2xl sm:rounded-[0.625rem] sm:border-x-2">
          {SETTING_ITEMS.map(({ label, key, options }) => (
            <div key={label} className="flex w-full max-w-80 items-center justify-between sm:max-w-[70%]">
              <span>{label}</span>
              {type === 'participant' ? (
                <span>{selectedValues[key]}</span>
              ) : (
                <Dropdown
                  options={convertToString(options)}
                  selectedValue={selectedValues[key].toString()}
                  handleChange={handleChange(key)}
                  className="w-[30%] min-w-[4.25rem] sm:min-w-28"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Setting };
