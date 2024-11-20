import { HTMLAttributes, useState } from 'react';
import Dropdown from '@/components/ui/Dropdown';
import { RoomSettings } from '@/types/gameShared.types';
import { cn } from '@/utils/cn';

type SettingKey = keyof RoomSettings;

interface RoomSettingItem {
  key: SettingKey;
  label: string;
  options: number[];
}

interface SettingProps extends HTMLAttributes<HTMLDivElement> {
  roomSettings?: RoomSettings;
  type: 'host' | 'participant';
}

export const ROOM_SETTINGS: RoomSettingItem[] = [
  { label: '라운드 수', key: 'totalRounds', options: [4, 6, 8] },
  { label: '플레이어 수', key: 'maxPlayers', options: [4, 5, 6] },
  { label: '제한 시간', key: 'drawTime', options: [15, 30] },
  { label: '픽셀 수', key: 'maxPixels', options: [300, 500] },
];

const Setting = ({ className, roomSettings, type, ...props }: SettingProps) => {
  const [selectedValues, setSelectedValues] = useState<RoomSettings>({
    totalRounds: roomSettings?.totalRounds || 4,
    maxPlayers: roomSettings?.maxPlayers || 4,
    drawTime: roomSettings?.drawTime || 30,
    maxPixels: roomSettings?.drawTime || 300,
  });

  const handleChange = (key: SettingKey) => (value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const convertToString = (options: number[]) => options.map((option) => String(option));

  return (
    <section
      className={cn('flex w-full flex-col border-0 border-violet-950 sm:rounded-xl sm:border-2', className)}
      {...props}
    >
      {/* Setting title */}
      <div className="flex h-14 w-full items-center justify-center border-0 border-violet-950 bg-violet-500 sm:h-16 sm:rounded-t-xl sm:border-b-2">
        <h2 className="text-2xl text-white text-stroke-md sm:translate-y-1 lg:text-3xl">Setting</h2>
      </div>

      {/* Setting content */}
      <div className="flex min-h-[16.125rem] items-center justify-center bg-violet-200 sm:min-h-[18.56rem] sm:rounded-b-xl sm:px-6">
        <div className="flex min-h-[13.8rem] w-full flex-col items-center justify-center gap-4 border-0 border-violet-950 bg-violet-50 p-4 text-xl sm:h-auto sm:rounded-[0.625rem] sm:border-2 lg:gap-6 lg:text-2xl">
          {ROOM_SETTINGS.map(({ label, key, options }) => (
            <div key={label} className="flex w-full max-w-80 items-center justify-between sm:max-w-[70%]">
              <span>{label}</span>
              {type === 'participant' ? (
                <span>{selectedValues[key]}</span>
              ) : (
                <Dropdown
                  options={convertToString(options)}
                  selectedValue={selectedValues[key].toString()}
                  handleChange={handleChange(key)}
                  className="h-7 w-[30%] min-w-[4.25rem] text-xl sm:min-w-28 lg:h-auto lg:text-2xl"
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
