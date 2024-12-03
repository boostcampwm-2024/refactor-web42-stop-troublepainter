import { useCallback, useEffect } from 'react';
import { Player, TerminationType } from '@troublepainter/core';
import { useNavigate } from 'react-router-dom';
import podium from '@/assets/podium.gif';
import { useTimeout } from '@/hooks/useTimeout';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { useToastStore } from '@/stores/toast.store';
import { cn } from '@/utils/cn';

const ResultPage = () => {
  const navigate = useNavigate();

  const players = useGameSocketStore((state) => state.players);
  const roomId = useGameSocketStore((state) => state.room?.roomId);
  const terminateType = useGameSocketStore((state) => state.gameTerminateType);
  const gameActions = useGameSocketStore((state) => state.actions);
  const toastActions = useToastStore((state) => state.actions);

  const [firstPlace, secondPlace, thirdPlace] = players;

  useEffect(() => {
    const description =
      terminateType === TerminationType.PLAYER_DISCONNECT
        ? '나간 플레이어가 있어요. 20초 후 대기실로 이동합니다!'
        : '20초 후 대기실로 이동합니다!';

    toastActions.addToast({
      title: '게임 종료',
      description,
      variant: 'success',
      duration: 20000,
    });
  }, [terminateType]);

  const handleTimeout = useCallback(() => {
    gameActions.resetGame();
    navigate(`/lobby/${roomId}`);
  }, [gameActions, navigate, roomId]);

  useTimeout(handleTimeout, 20000);

  const positionStyles = {
    first: {
      scorePosition: 'bottom-[36%] left-[48%]',
      profilePosition: 'left-[38%] top-[29%]',
      profileTextClass: 'sm:left-[42%] sm:top-[28.5%]',
    },
    second: {
      scorePosition: 'bottom-[23%] left-[18%]',
      profilePosition: 'bottom-[37%] left-[9%]',
      profileTextClass: 'sm:left-[13%] sm:bottom-[38%]',
    },
    third: {
      scorePosition: 'bottom-[18%] right-[17.5%]',
      profilePosition: 'bottom-[28%] right-[8%]',
      profileTextClass: 'sm:right-[12%] sm:bottom-[29%]',
    },
  };

  const renderPlayer = (player: Player, position: 'first' | 'second' | 'third') => {
    if (!player || player.score === 0) return null;

    const { scorePosition, profilePosition, profileTextClass } = positionStyles[position];
    const { score, nickname, profileImage } = player;

    return (
      <>
        {/* 점수 */}
        <span className={cn(`absolute text-2xl sm:text-3xl`, scorePosition)}>{String(score).padStart(2, '0')}</span>
        {/* 프로필 */}
        <div
          className={cn(
            'absolute flex animate-bounce flex-col items-center justify-center',
            profilePosition,
            profileTextClass,
          )}
        >
          <img
            src={profileImage}
            alt={`${nickname} 프로필 사진`}
            className={cn(
              'rounded-[0.3rem] border-2 border-chartreuseyellow-500 bg-eastbay-50',
              'h-10 w-10',
              'sm:h-16 sm:w-16',
            )}
          />
          <span className="text-md text-stroke-sm">
            <span className="text-chartreuseyellow-400">{nickname}</span>
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
