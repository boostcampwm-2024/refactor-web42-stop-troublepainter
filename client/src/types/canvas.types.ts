import { MouseEvent, TouchEvent } from 'react';
import { DrawingData } from '@troublepainter/core';
import { DRAWING_MODE } from '@/constants/canvasConstants';

interface PenOptions {
  mode: number;
  colorNum: number;
  lineWidth: number;
}

export type SelectingPenOptions = Partial<PenOptions>;

export type PenModeType = (typeof DRAWING_MODE)[keyof typeof DRAWING_MODE];

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

export interface StrokeHistoryEntry {
  strokeIds: string[];
  isLocal: boolean;
  drawingData: DrawingData;
}

export interface DrawingOptions {
  maxPixels?: number;
}

export type DrawingMode = (typeof DRAWING_MODE)[keyof typeof DRAWING_MODE];

export interface CanvasEventHandlers {
  onMouseDown?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onTouchStart?: (e: TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove?: (e: TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd?: (e: TouchEvent<HTMLCanvasElement>) => void;
  onTouchCancel?: (e: TouchEvent<HTMLCanvasElement>) => void;
}
