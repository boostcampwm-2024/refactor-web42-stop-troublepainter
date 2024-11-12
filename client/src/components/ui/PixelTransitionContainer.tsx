import { HTMLAttributes, PropsWithChildren } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const contentVariants = cva('transition-transform duration-1000', {
  variants: {
    exitDirection: {
      left: '-translate-x-full',
      right: 'translate-x-full',
      up: '-translate-y-full',
      down: 'translate-y-full',
    },
  },
  defaultVariants: {
    exitDirection: 'left',
  },
});

interface PixelTransitionProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  // 전환 애니메이션의 활성화 상태 제어
  isExiting?: boolean;
  // 전환 시 콘텐츠가 이동할 방향 지정
  exitDirection?: VariantProps<typeof contentVariants>['exitDirection'];
}

/**
 * 페이지 페이드 아웃 시 전환 효과를 위한 컨테이너입니다.
 *
 * @example
 * ```tsx
 * const MyPage = () => {
 *   const [isExiting, setIsExiting] = useState(false);
 *
 *   const handleExit = () => {
 *     setIsExiting(true);
 *     // 애니메이션이 끝난 후 페이지 전환
 *     setTimeout(() => {
 *       // 페이지 전환 로직
 *     }, 1000);
 *   };
 *
 *   return (
 *     <PixelTransitionContainer
 *       isExiting={isExiting}
 *       exitDirection="left"
 *       className="h-screen w-screen"
 *     >
 *       <main
 *        className={cn(
 *          'h-screen w-screen',
 *          isExiting ? 'bg-transparent' : 'bg-violet-600',
 *        )}
 *       >
 *         내부 페이지 콘텐츠
 *       </main>
 *     </PixelTransitionContainer>
 *   );
 * };
 * ```
 */
const PixelTransitionContainer = ({
  isExiting = false,
  exitDirection = 'left',
  children,
  className,
  ...props
}: PixelTransitionProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-colors duration-700',
        isExiting ? 'bg-transparent' : 'bg-violet-950',
        className,
      )}
      aria-busy={isExiting}
      aria-live="polite"
      {...props}
    >
      {/* 픽셀 그리드 오버레이 */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-700',
          'grid aspect-square grid-cols-5 xs:grid-cols-6 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10',
          isExiting ? 'z-50 opacity-100' : 'z-0 opacity-0',
        )}
        aria-hidden="true"
      >
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'aspect-square border bg-transparent transition-[transform,border-color,background-color]',
              'duration-600 border-transparent',
              isExiting ? 'border-violet-800 bg-violet-500' : 'border-transparent bg-transparent',
            )}
            style={{
              transitionDelay: `${((i % 7) + Math.floor(i / 7)) * 50}ms`,
              transform: isExiting ? 'scale(0.9) rotate(10deg)' : 'scale(1) rotate(0deg)',
            }}
          />
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className={cn('relative', isExiting && contentVariants({ exitDirection }))}>{children}</div>
    </div>
  );
};

export { PixelTransitionContainer };
