export type Setting = {
  label: string;
  key: SettingKey;
  options: SettingOption[];
};

export type SettingKey = 'roundCount' | 'playerCount' | 'timeLimit';

export type SettingValues = {
  [K in SettingKey]: number;
};

export type SettingOption = {
  id: number;
  value: number;
};
