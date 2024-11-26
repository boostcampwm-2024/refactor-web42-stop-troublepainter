import { cn } from '@/utils/cn';

interface PlayerCardStatusProps {
  score?: number;
  isHost: boolean | null;
  isPlaying: boolean;
  isMe: boolean | null;
  className?: string;
}

export const PlayerCardStatus = ({ score, isHost, isPlaying, isMe, className }: PlayerCardStatusProps) => {
  if (!score && !isHost) return null;

  return (
    /* 데스크탑 점수/상태 표시 섹션 */
    <div className={cn('hidden items-center gap-2 lg:flex', className)}>
      {score !== undefined && isPlaying && (
        <div className="flex aspect-square h-8 items-center justify-center rounded-lg border-2 border-violet-950 bg-halfbaked-200 xl:h-10">
          <div className="translate-x-[0.05rem] leading-5 text-eastbay-950 lg:text-lg xl:text-2xl">{score}</div>
        </div>
      )}

      {!isPlaying && isHost && (
        <div
          className={cn(
            'cursor-default rounded-md px-2 py-1 text-xs font-medium text-white shadow-lg hover:animate-spin xl:text-sm',
            isMe ? 'bg-violet-200 text-violet-900' : 'bg-halfbaked-200 text-halfbaked-900',
          )}
        >
          방장
        </div>
      )}
    </div>
  );
};
