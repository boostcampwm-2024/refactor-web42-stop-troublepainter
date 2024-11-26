import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const MAX_TOASTS = 5;

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
          const id = new Date().getTime().toString();
          // 새로운 토스트 준비
          const newToast = {
            ...config,
            id,
          };

          set((state) => {
            if (config.duration !== Infinity) {
              setTimeout(() => {
                set((state) => ({
                  toasts: state.toasts.filter((t) => t.id !== id),
                }));
              }, config.duration || 3000);
            }

            // 현재 토스트가 최대 개수에 도달한 경우
            if (state.toasts.length >= MAX_TOASTS) {
              // 가장 오래된 토스트를 제외하고 새 토스트 추가
              return {
                toasts: [...state.toasts.slice(1), newToast],
              };
            }

            // 최대 개수에 도달하지 않은 경우 단순 추가
            return {
              toasts: [...state.toasts, newToast],
            };
          });
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
