import { SettingOption, Setting, SettingKey } from '@/types/setting.types';

export const OPTIONS: Record<SettingKey, SettingOption[]> = {
  roundCount: [
    { id: 1, value: 4 },
    { id: 2, value: 6 },
    { id: 3, value: 8 },
  ],
  playerCount: [
    { id: 1, value: 4 },
    { id: 2, value: 5 },
    { id: 3, value: 6 },
  ],
  timeLimit: [
    { id: 1, value: 15 },
    { id: 2, value: 30 },
  ],
} as const;

export const SETTING_ITEMS: Setting[] = [
  { label: '라운드 수', key: 'roundCount', options: OPTIONS.roundCount },
  { label: '플레이어 수', key: 'playerCount', options: OPTIONS.playerCount },
  { label: '제한 시간', key: 'timeLimit', options: OPTIONS.timeLimit },
] as const;
