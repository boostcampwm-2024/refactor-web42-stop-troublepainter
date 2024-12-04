import { HTMLAttributes, memo, useCallback, useEffect, useState } from 'react';
import { RoomSettings } from '@troublepainter/core';
import { SettingContent } from '@/components/setting/SettingContent';
import { SHORTCUT_KEYS } from '@/constants/shortcutKeys';
import { gameSocketHandlers } from '@/handlers/socket/gameSocket.handler';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { cn } from '@/utils/cn';

type SettingKey = keyof RoomSettings;

export interface RoomSettingItem {
  key: SettingKey;
  label: string;
  options: number[];
  shortcutKey: keyof typeof SHORTCUT_KEYS;
}

export const ROOM_SETTINGS: RoomSettingItem[] = [
  { label: '라운드 수', key: 'totalRounds', options: [3, 5], shortcutKey: 'DROPDOWN_TOTAL_ROUNDS' },
  { label: '최대 플레이어 수', key: 'maxPlayers', options: [4, 5], shortcutKey: 'DROPDOWN_MAX_PLAYERS' },
  { label: '제한 시간', key: 'drawTime', options: [15, 20, 25, 30], shortcutKey: 'DROPDOWN_DRAW_TIME' },
  //{ label: '픽셀 수', key: 'maxPixels', options: [300, 500] },
];

const Setting = memo(({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  // 개별 selector로 필요한 상태만 구독
  const roomSettings = useGameSocketStore((state) => state.roomSettings);
  const isHost = useGameSocketStore((state) => state.isHost);
  const actions = useGameSocketStore((state) => state.actions);

  const [selectedValues, setSelectedValues] = useState<RoomSettings>(
    roomSettings ?? {
      totalRounds: 5,
      maxPlayers: 5,
      drawTime: 30,
    },
  );

  useEffect(() => {
    if (!roomSettings) return;
    setSelectedValues(roomSettings);
  }, [roomSettings]);

  useEffect(() => {
    if (!isHost || !selectedValues || !selectedValues.drawTime) return;
    // 방장일 때만 실행되는 설정 업데이트
    void gameSocketHandlers.updateSettings({
      settings: { ...selectedValues, drawTime: selectedValues.drawTime + 5 },
    });
    actions.updateRoomSettings(selectedValues);
  }, [selectedValues, isHost]);

  const handleSettingChange = useCallback((key: keyof RoomSettings, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  }, []);

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
      <SettingContent
        settings={ROOM_SETTINGS}
        values={selectedValues}
        isHost={isHost || false}
        onSettingChange={handleSettingChange}
      />
    </section>
  );
});

export { Setting };
