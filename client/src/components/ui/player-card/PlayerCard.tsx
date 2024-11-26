import { PlayerRole } from '@troublepainter/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { PlayerCardInfo } from '@/components/ui/player-card/PlayerInfo';
import { PlayerCardProfile } from '@/components/ui/player-card/PlayerProfile';
import { PlayerCardStatus } from '@/components/ui/player-card/PlayerStatus';
import { cn } from '@/utils/cn';

const playerCardVariants = cva(
  'flex h-20 w-20 items-center gap-2 duration-200 lg:aspect-[3/1] lg:w-full lg:items-center lg:justify-between lg:rounded-lg lg:border-2 lg:p-1 lg:transition-colors xl:p-3',
  {
    variants: {
      status: {
        // 게임 참여 전 상태
        NOT_PLAYING: 'bg-transparent lg:bg-eastbay-400',
        // 게임 진행 중 상태
        PLAYING: 'bg-transparent lg:bg-eastbay-400',
      },
      isMe: {
        true: 'bg-transparent lg:bg-violet-500 lg:border-violet-800',
        false: 'lg:border-halfbaked-800',
      },
    },
    defaultVariants: {
      status: 'NOT_PLAYING',
      isMe: false,
    },
  },
);

interface PlayerCardProps extends VariantProps<typeof playerCardVariants> {
  /// 공통 필수
  // 사용자 이름
  nickname: string;

  /// 게임방 필수
  // 사용자가 1등일 경우
  isWinner?: boolean;
  // 사용자 점수 (게임 중일 때만 표시)
  score?: number;
  // 사용자 역할 (그림꾼, 방해꾼 등)
  role?: PlayerRole | null;
  // 방장 확인 props
  isHost: boolean | null;

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
 * <PlayerCard
 *   nickname="Player1"
 *   status="PLAYING"
 * />
 *
 * // 게임 중인 1등 사용자
 * <PlayerCard
 *   nickname="Player1"
 *   role="그림꾼"
 *   score={100}
 *   isWinner={true}
 *   status="NOT_PLAYING"
 * />
 */
const PlayerCard = ({
  nickname,
  isWinner,
  score,
  role = null,
  status = 'NOT_PLAYING',
  isHost = false,
  isMe = false,
  profileImage,
  className,
}: PlayerCardProps) => {
  return (
    <div className={cn(playerCardVariants({ status, isMe }), className)}>
      <div className="flex flex-col items-center justify-center lg:flex-row lg:gap-1 xl:gap-1.5">
        <PlayerCardProfile
          nickname={nickname}
          profileImage={profileImage}
          isWinner={isWinner}
          score={score}
          isHost={isHost || false}
          isMe={isMe}
          showScore={status === 'PLAYING'}
        />
        <PlayerCardInfo nickname={nickname} role={role} />
      </div>
      <PlayerCardStatus score={score} isHost={isHost} isPlaying={status === 'PLAYING'} isMe={isMe} />
    </div>
  );
};

export { PlayerCard, type PlayerCardProps, playerCardVariants };
