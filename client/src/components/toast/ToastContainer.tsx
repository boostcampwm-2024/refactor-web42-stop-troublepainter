import { useEffect, useState } from 'react';
import { Toast } from '@/components/ui/Toast';
import { ToastConfig, useToastStore } from '@/stores/toast.store';
import { cn } from '@/utils/cn';

interface AnimatedToast extends ToastConfig {
  isVisible: boolean;
  isLeaving: boolean;
}

export const ToastContainer = () => {
  const { toasts, actions } = useToastStore();
  const [animatedToasts, setAnimatedToasts] = useState<AnimatedToast[]>([]);

  // 토스트 추가 처리
  useEffect(() => {
    const newToasts = toasts.filter((toast) => !animatedToasts.find((aToast) => aToast.id === toast.id));

    if (newToasts.length > 0) {
      // 먼저 invisible 상태로 추가
      setAnimatedToasts((prev) => [
        ...prev,
        ...newToasts.map((toast) => ({
          ...toast,
          isVisible: false, // 처음에는 false로 설정
          isLeaving: false,
        })),
      ]);

      // 새로 추가된 토스트만 약간의 딜레이 후 visible로 변경
      const timeoutId = setTimeout(() => {
        setAnimatedToasts((prev) =>
          prev.map((toast) => ({
            ...toast,
            isVisible: true,
          })),
        );
      }, 50); // 약간의 지연 추가

      return () => clearTimeout(timeoutId);
    }
  }, [toasts]); // animatedToasts는 의존성에서 제거

  // 토스트 제거 처리
  useEffect(() => {
    const toastIds = new Set(toasts.map((t) => t.id));

    setAnimatedToasts((prev) =>
      prev.map((toast) => ({
        ...toast,
        isLeaving: toast.id ? !toastIds.has(toast.id) : false,
      })),
    );
  }, [toasts]);

  // 퇴장 애니메이션 완료 후 cleanup
  useEffect(() => {
    const leavingToasts = animatedToasts.filter((toast) => toast.isLeaving);

    if (leavingToasts.length > 0) {
      const timer = setTimeout(() => {
        setAnimatedToasts((prev) => prev.filter((toast) => !toast.isLeaving));
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [animatedToasts]);

  if (animatedToasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="알림"
      className="fixed inset-0 right-1 top-1 z-[100] flex flex-col items-end justify-start gap-1 p-4 sm:right-4 sm:top-4 sm:gap-2"
    >
      {animatedToasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'w-full max-w-80 transform transition-all duration-300 ease-out lg:max-w-96',
            // 초기 상태 (마운트 전)
            'translate-y-3 opacity-0',
            // 진입 애니메이션 (마운트)
            toast.isVisible && !toast.isLeaving && 'translate-y-0 opacity-100',
            // 퇴장 애니메이션
            toast.isLeaving && '-translate-y-3 opacity-0',
          )}
        >
          <Toast
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            onClose={() => toast.id && actions.removeToast(toast.id)}
            aria-describedby={toast.description ? `toast-description-${toast.id}` : undefined}
            aria-labelledby={toast.title ? `toast-title-${toast.id}` : undefined}
          />
        </div>
      ))}
    </div>
  );
};
