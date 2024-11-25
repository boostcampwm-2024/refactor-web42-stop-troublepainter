import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const toastVariants = cva('flex items-center justify-between rounded-lg border-2 border-violet-950 p-4 shadow-lg', {
  variants: {
    variant: {
      default: 'bg-violet-200 text-violet-950',
      error: 'bg-red-100 text-red-900 border-red-900',
      success: 'bg-green-100 text-green-900 border-green-900',
      warning: 'bg-yellow-100 text-yellow-900 border-yellow-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ToastProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  onClose?: () => void;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, onClose, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
        {/* Content */}
        <div className="flex flex-1 flex-col gap-1">
          {title && <div className="text-base font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-black/10"
            aria-label="닫기"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = 'Toast';

export { Toast, type ToastProps, toastVariants };
