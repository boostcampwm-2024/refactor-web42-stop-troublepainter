import crownFirst from '@/assets/crown-first.png';
import profilePlaceholder from '@/assets/profile-placeholder.png';
import { cn } from '@/utils/cn';

interface PlayerCardProfileProps {
  nickname: string;
  profileImage?: string;
  isWinner?: boolean;
  score?: number;
  isHost: boolean;
  isMe: boolean | null;
  showScore?: boolean;
  className?: string;
}

export const PlayerCardProfile = ({
  nickname,
  profileImage,
  isWinner,
  score,
  isHost,
  isMe,
  showScore = false,
  className,
}: PlayerCardProfileProps) => {
  // 순위에 따른 Crown Image 렌더링 로직
  const showCrown = isWinner !== undefined;

  return (
    <div className={cn('relative mb-1 lg:m-0', className)}>
      <div
        className={cn(
          'relative flex h-12 w-12 items-center justify-center overflow-hidden lg:h-14 lg:w-14',
          'rounded-full border-2 bg-white/20 lg:rounded-xl',
          // 본인 여부에 따른 테두리 색상
          isMe ? (isHost ? 'border-halfbaked-900' : 'border-violet-900') : 'border-halfbaked-900',
        )}
      >
        <img
          src={profileImage || profilePlaceholder}
          alt={`${nickname}의 프로필`}
          className="h-full w-full object-cover"
        />

        {/* 모바일 상태 오버레이 */}
        {showScore ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 lg:hidden">
            <span className="text-xl font-bold text-white text-stroke-sm">{score}</span>
          </div>
        ) : (
          <>
            {((isHost && !isMe) || isMe) && (
              <div
                className={cn(
                  `absolute inset-0 flex items-center justify-center rounded-full lg:hidden`,
                  isHost ? 'bg-halfbaked-500/50' : 'bg-violet-500/50',
                )}
              >
                <span className="text-xs text-stroke-sm">{isMe ? '나!' : '방장'}</span>
              </div>
            )}
          </>
        )}

        {/* 왕관 이미지 */}
        {showCrown && (
          <img
            src={crownFirst}
            alt={`1등 왕관 아이콘`}
            className="absolute -right-1 -top-3 h-7 w-auto rotate-[30deg] lg:-right-5 lg:-top-7 lg:h-12"
          />
        )}
      </div>
    </div>
  );
};
