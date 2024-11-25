import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ToastConfig {
  id?: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'error' | 'success' | 'warning';
}

interface ToastState {
  toasts: ToastConfig[];
  actions: {
    addToast: (config: ToastConfig) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
  };
}

/**
 * 토스트 알림을 전역적으로 관리하는 Store입니다.
 *
 * @example
 * ```typescript
 * const { toasts, actions } = useToastStore();
 *
 * // 토스트 추가
 * actions.addToast({
 *   title: '성공!',
 *   description: '작업이 완료되었습니다.',
 *   variant: 'success',
 *   duration: 3000
 * });
 * ```
 */
export const useToastStore = create<ToastState>()(
  devtools(
    (set) => ({
      toasts: [],
      actions: {
        addToast: (config) => {
          const id = crypto.randomUUID();
          const toast = { ...config, id };

          set((state) => ({
            toasts: [...state.toasts, toast],
          }));

          if (config.duration !== Infinity) {
            setTimeout(() => {
              set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
              }));
            }, config.duration || 3000);
          }
        },

        removeToast: (id) =>
          set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
          })),

        clearToasts: () => set({ toasts: [] }),
      },
    }),
    { name: 'ToastStore' },
  ),
);
