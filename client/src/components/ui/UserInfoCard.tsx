import { cva, type VariantProps } from 'class-variance-authority';
import profilePlaceholder from '@/assets/profile-placeholder.png';
import { PlayerRole, PlayerStatus } from '@/types/game.types';
import { cn } from '@/utils/cn';
import getCrownImage from '@/utils/getCrownImage';

const userInfoCardVariants = cva('flex duration-200 gap-2 lg:transition-colors', {
  variants: {
    status: {
      // 대기 상태 - 기본 상태
      NOT_READY: 'bg-transparent lg:bg-eastbay-400 text-white',
      // 준비 완료 상태
      READY: 'bg-transparent lg:bg-violet-500 text-white',
      // 게임 진행 중 상태
      PLAYING: 'bg-transparent lg:bg-eastbay-400 text-white',
    },
  },
  defaultVariants: {
    status: 'NOT_READY',
  },
});

interface UserInfoCardProps extends VariantProps<typeof userInfoCardVariants> {
  /// 공통 필수
  // 사용자 이름
  username: string;

  /// 게임방 필수
  // 사용자 순위 (1~3등일 경우 왕관 표시)
  rank?: 0 | 1 | 2;
  // 사용자 점수 (게임 중일 때만 표시)
  score?: number;
  // 사용자 역할 (그림꾼, 방해꾼 등)
  role?: PlayerRole | null;

  /// 공통 선택
  // 추가 스타일링을 위한 className
  className?: string;
  // 프로필 이미지 URL (없을 경우 기본 이미지 사용)
  profileImage?: string;
}

/**
 * 사용자 정보를 표시하는 카드 컴포넌트입니다.
 *
 * @component
 * @example
 * // 대기 상태의 사용자
 * <UserInfoCard
 *   username="Player1"
 *   status="notReady"
 * />
 *
 * // 게임 중인 1등 사용자
 * <UserInfoCard
 *   username="Player1"
 *   role="그림꾼"
 *   score={100}
 *   rank={1}
 *   status="gaming"
 * />
 */
const UserInfoCard = ({
  username,
  rank,
  score,
  role = null,
  profileImage,
  status = 'NOT_READY',
  className,
}: UserInfoCardProps) => {
  // 순위에 따른 Crown Image 렌더링 로직
  const showCrown = rank !== undefined && rank <= 3;
  const crownImage = showCrown ? getCrownImage(rank) : null;

  // 준비 상태 표시 섹션 재료, 추후 픽셀아트로 디자인 할 예정
  const READY_STATUS_CONFIG: Record<
    PlayerStatus,
    {
      text: string;
      className: string;
    } | null
  > = {
    READY: {
      text: '준비완료',
      className: 'text-white bg-violet-400',
    },
    NOT_READY: {
      text: '대기중',
      className: 'bg-white/10 text-white/60',
    },
    PLAYING: null,
  } as const;

  return (
    <div
      className={cn(
        userInfoCardVariants({ status }),
        // 모바일
        'h-20 w-20 items-center',
        // 데스트톱
        'lg:aspect-[3/1] lg:w-full lg:items-center lg:justify-between lg:rounded-lg lg:border-2 lg:border-violet-950 lg:p-1 xl:p-3',
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center lg:flex-row lg:gap-3">
        {/* 프로필 이미지 섹션 */}
        <div className="relative mb-1 lg:m-0">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-violet-950 bg-white/20 lg:h-14 lg:w-14 lg:rounded-xl">
            <img src={profileImage || profilePlaceholder} alt="사용자 프로필" />
            {/* 모바일 상태 오버레이 */}
            {status !== 'PLAYING' ? (
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center rounded-full transition-all duration-300 lg:hidden',
                  {
                    'bg-violet-500/80 opacity-100': status === 'READY',
                    'bg-transparent opacity-0': status !== 'READY',
                  },
                )}
              >
                {status === 'READY' && <span className="text-xs text-stroke-sm">준비</span>}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 lg:hidden">
                <span className="text-xl font-bold text-white text-stroke-sm">{score}</span>
              </div>
            )}
            {/* 왕관 이미지 */}
            {crownImage && (
              <img
                src={crownImage}
                alt={`${rank}등 사용자`}
                className="absolute -right-1 -top-3 h-7 w-auto rotate-[30deg] lg:-right-5 lg:-top-7 lg:h-12"
              />
            )}
          </div>
        </div>

        {/* 사용자 정보 섹션 */}
        <div className="relative flex -translate-y-1 flex-col text-center lg:translate-y-0 lg:items-start">
          <div className="relative h-3 text-stroke-sm lg:h-auto">
            <div
              title={username}
              className={cn(
                // 기본 & 모바일 스타일
                'w-20 truncate text-xs text-chartreuseyellow-400',
                // 데스크톱
                'lg:w-auto lg:max-w-28 lg:text-base',
                'xl:max-w-[9.5rem] xl:text-lg',
                '2xl:max-w-52 2xl:text-xl',
              )}
            >
              {username}
            </div>
          </div>
          <div className="h-3 text-stroke-sm lg:h-auto">
            <div
              title={role || '???'}
              className={cn(
                // 기본 & 모바일 스타일
                'w-20 truncate text-[0.625rem] text-gray-50',
                // 데스크톱
                'lg:w-auto lg:max-w-28 lg:text-sm',
                'xl:max-w-[9.5rem] xl:text-base',
                '2xl:max-w-52',
              )}
            >
              {role || '???'}
            </div>
          </div>
        </div>
      </div>

      {/* 데스크탑 점수/상태 표시 섹션 */}
      <div className="hidden items-center gap-2 lg:flex">
        {score !== undefined && (
          <div className="flex aspect-square h-8 items-center justify-center rounded-lg border-2 border-violet-950 bg-halfbaked-200 xl:h-10">
            <div className="translate-x-[0.05rem] leading-5 text-eastbay-950 lg:text-lg xl:text-2xl">{score}</div>
          </div>
        )}

        {status !== 'PLAYING' && (
          <div
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium',
              READY_STATUS_CONFIG[status || 'NOT_READY']?.className,
            )}
          >
            {READY_STATUS_CONFIG[status || 'NOT_READY']?.text}
          </div>
        )}
      </div>
    </div>
  );
};

export { UserInfoCard, userInfoCardVariants };
