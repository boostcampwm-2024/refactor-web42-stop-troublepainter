import { PlayerRole } from '@troublepainter/core';
import { cn } from '@/utils/cn';

interface PlayerInfoProps {
  nickname: string;
  role?: PlayerRole | null;
  className?: string;
}

export const PlayerInfo = ({ nickname, role, className }: PlayerInfoProps) => {
  return (
    /* 사용자 정보 섹션 */
    <div className={cn('relative flex -translate-y-1 flex-col text-center lg:translate-y-0 lg:items-start', className)}>
      <div className="relative h-3 text-stroke-sm lg:h-auto">
        <div
          title={nickname}
          className={cn(
            'w-20 truncate pl-0.5 text-xs text-chartreuseyellow-400',
            'lg:w-full lg:max-w-28 lg:text-base',
            'xl:max-w-[9.5rem] xl:text-lg',
            '2xl:max-w-52 2xl:text-xl',
          )}
        >
          {`${nickname}`}
        </div>
      </div>
      <div className="h-3 text-stroke-sm lg:h-auto">
        <div
          title={role || '???'}
          className={cn(
            'w-20 truncate pl-0.5 text-[0.625rem] text-gray-50',
            'lg:w-full lg:max-w-28 lg:text-sm',
            'xl:max-w-[9.5rem] xl:text-base',
            '2xl:max-w-52',
          )}
        >
          {role || '???'}
        </div>
      </div>
    </div>
  );
};
