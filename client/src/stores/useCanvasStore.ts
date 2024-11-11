import { create } from 'zustand';
import { CanvasStore, SelectingPenOptions } from '@/types/canvas.types';

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
    setPenSetting: (penSetting: SelectingPenOptions) => {
      set((state) => {
        const newPenSettingState = { ...state.penSetting, ...penSetting };
        return { ...state, penSetting: newPenSettingState };
      });
    },
    setPenMode: (mode: number) => {
      set((state) => {
        const newPenSettingState = { ...state.penSetting, mode };
        return { ...state, penSetting: newPenSettingState };
      });
    },
  },
}));
