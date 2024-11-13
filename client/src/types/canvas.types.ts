import { MouseEvent, TouchEvent } from 'react';
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

//아래 태연님 코드 관련

export interface CanvasEventHandlers {
  onMouseDown?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onTouchStart?: (e: TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove?: (e: TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd?: (e: TouchEvent<HTMLCanvasElement>) => void;
  onTouchCancle?: (e: TouchEvent<HTMLCanvasElement>) => void;
}
