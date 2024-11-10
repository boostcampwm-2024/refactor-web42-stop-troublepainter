import { create } from 'zustand';
import { CanvasStore } from '@/types/canvas.types';

const canvasDefaultConfig = {
  inkRemaining: 500,
  canDrawing: false,
  penSetting: {
    mode: 0,
    colorNum: 0,
    lineWidth: 2, //짝수 단위가 좋음
  },
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  ...canvasDefaultConfig,
  action: {
    setCanDrawing: (canDrawing: boolean) => {
      set(() => ({ canDrawing }));
    },
  },
}));
