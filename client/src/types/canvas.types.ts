import { PENMODE } from '@/constants/canvasConstants';

interface PenOptions {
  mode: number;
  colorNum: number;
  lineWidth: number; //짝수 단위가 좋음
}

export type SelectingPenOptions = Partial<PenOptions>;

export type PenModeType = (typeof PENMODE)[keyof typeof PENMODE];

export interface CanvasStore {
  canDrawing: boolean;
  penSetting: PenOptions;
  action: {
    setCanDrawing: (canDrawing: boolean) => void;
    setPenSetting: (penSetting: SelectingPenOptions) => void;
    setPenMode: (penMode: PenModeType) => void;
  };
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}
