import { Player } from '@troublepainter/core';
import { cn } from '@/utils/cn';

const positionStyles = {
  first: {
    containerStyle: 'absolute w-[40%] left-[30%] top-[29%]',
    scoreStyle: 'bottom-[36%] left-[48%]',
  },
  second: {
    containerStyle: 'absolute w-[40%] left-[1%] bottom-[37%]',
    scoreStyle: 'bottom-[23%] left-[18%]',
  },
  third: {
    containerStyle: 'absolute w-[40%] right-[1%] bottom-[28%]',
    scoreStyle: 'bottom-[18%] right-[17.5%]',
  },
};

interface PodiumPlayersProps {
  players: Player[];
  position: 'first' | 'second' | 'third';
}

const PodiumPlayers = ({ players, position }: PodiumPlayersProps) => {
  if (!players || players.length === 0 || players[0].score === 0) return null;

  const { containerStyle, scoreStyle } = positionStyles[position];

  return (
    <>
      <span className={cn(`absolute text-2xl sm:text-3xl`, scoreStyle)}>
        {String(players[0].score).padStart(2, '0')}
      </span>
      <div className={cn('flex justify-center gap-2', containerStyle)}>
        {players.map((player) => (
          <div key={player.playerId} className={cn('flex animate-bounce flex-col items-center justify-center')}>
            <img
              src={player.profileImage}
              alt={`${player.nickname} 프로필 사진`}
              className={cn(
                'rounded-[0.3rem] border-2 border-chartreuseyellow-500 bg-eastbay-50',
                'h-10 w-10',
                'sm:h-16 sm:w-16',
              )}
            />
            <span className="truncate text-xs text-stroke-sm sm:text-base">
              <span className="text-chartreuseyellow-400">{player.nickname}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default PodiumPlayers;
