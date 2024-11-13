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
 * 페이지 전환 시 픽셀화 애니메이션 효과를 제공하는 컨테이너 컴포넌트입니다.
 *
 * @description
 * 페이지 전환 시 콘텐츠를 부드럽게 전환하며, 픽셀화되는 효과를 보여줍니다.
 * `usePageTransition` 훅과 함께 사용해야합니다.
 *
 * @example
 * ```tsx
 * const MyPage = () => {
 *   const { isExiting, transitionTo } = usePageTransition();
 *
 *   return (
 *     <PixelTransitionContainer
 *       isExiting={isExiting}
 *       exitDirection="left"
 *       className="min-h-screen"
 *     >
 *       <main className={cn(
 *         'min-h-screen',
 *         isExiting ? 'bg-transparent' : 'bg-violet-600'
 *       )}>
 *         페이지 콘텐츠
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
        isExiting ? 'bg-violet-950' : 'bg-transparent',
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
