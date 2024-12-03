import { Player } from '@troublepainter/core';
import { useNavigate } from 'react-router-dom';
import podium from '@/assets/podium.gif';
import { useTimeout } from '@/hooks/useTimeout';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { cn } from '@/utils/cn';

const ResultPage = () => {
  const players = useGameSocketStore((state) => state.players);
  const roomId = useGameSocketStore((state) => state.room?.roomId);
  const actions = useGameSocketStore((state) => state.actions);
  const [firstPlace, secondPlace, thirdPlace] = players;
  const navigate = useNavigate();

  useTimeout(() => {
    actions.resetGame();
    navigate(`/lobby/${roomId}`);
  }, 20000);

  // 포지션 스타일 상수화
  const positionStyles = {
    first: {
      scorePosition: 'bottom-[35%] left-[47%]',
      profilePosition: 'left-[38%] top-[29%]',
      scoreTextClass: 'text-2xl sm:text-3xl',
      profileTextClass: 'sm:left-[42%] sm:top-[28.5%]',
    },
    second: {
      scorePosition: 'bottom-[22.25%] left-[17.75%]',
      profilePosition: 'bottom-[37%] left-[9%]',
      scoreTextClass: 'text-2xl sm:text-3xl',
      profileTextClass: 'sm:left-[13%] sm:bottom-[38%]',
    },
    third: {
      scorePosition: 'bottom-[17%] right-[17%]',
      profilePosition: 'bottom-[28%] right-[8%]',
      scoreTextClass: 'text-2xl sm:text-3xl',
      profileTextClass: 'sm:right-[12%] sm:bottom-[29%]',
    },
  };

  const renderPlayer = (player: Player, position: 'first' | 'second' | 'third') => {
    if (!player) return null;

    const { scorePosition, profilePosition, scoreTextClass, profileTextClass } = positionStyles[position];

    return (
      <>
        {/* 점수 */}
        <span className={`absolute ${scorePosition} ${scoreTextClass}`}>{String(player.score).padStart(2, '0')}</span>
        {/* 프로필 */}
        <div
          className={cn(
            'absolute flex animate-bounce flex-col items-center justify-center',
            profilePosition,
            profileTextClass,
          )}
        >
          <img
            src={player.profileImage}
            alt={`${position}등 프로필 사진`}
            className={cn('rounded-[0.3rem] border-2 border-chartreuseyellow-500', 'h-10 w-10', 'sm:h-16 sm:w-16')}
          />
          <span className="text-md text-stroke-sm">
            <span className="text-chartreuseyellow-400">{player.nickname}</span>
          </span>
        </div>
      </>
    );
  };

  return (
    <section className="relative">
      <img src={podium} alt="" aria-hidden={true} className="w-[25rem] sm:w-[33.75rem]" />
      <span className="absolute left-14 top-[25%] text-4xl text-stroke-md sm:left-12 sm:text-7xl sm:text-stroke-lg">
        GAME
      </span>
      <span className="absolute right-14 top-[25%] text-4xl text-stroke-md sm:right-12 sm:text-7xl sm:text-stroke-lg">
        ENDS
      </span>

      {renderPlayer(firstPlace, 'first')}
      {renderPlayer(secondPlace, 'second')}
      {renderPlayer(thirdPlace, 'third')}
    </section>
  );
};

export default ResultPage;
