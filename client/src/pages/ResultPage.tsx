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
  const roomId = useGameSocketStore((state) => state.room?.roomId);
  const players = useGameSocketStore((state) => state.players);
  const terminateType = useGameSocketStore((state) => state.gameTerminateType);
  const gameActions = useGameSocketStore((state) => state.actions);
  const toastActions = useToastStore((state) => state.actions);

  const sortedScores = [...new Set(players.map((player) => player.score))].sort((a, b) => b - a);

  const [firstPlacePlayers, secondPlacePlayers, thirdPlacePlayers] = sortedScores.map((score) =>
    players.filter((player) => player.score === score),
  );

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
  }, [terminateType, toastActions]);

  const handleTimeout = useCallback(() => {
    gameActions.resetGame();
    navigate(`/lobby/${roomId}`);
  }, [gameActions, navigate, roomId]);

  useTimeout(handleTimeout, 20000);

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

  const renderPlayers = (players: Player[], position: 'first' | 'second' | 'third') => {
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

  return (
    <div className="relative">
      <section className="relative">
        <img src={podium} alt="" aria-hidden={true} className="w-[25rem] sm:w-[33.75rem]" />
        <span className="absolute left-14 top-[25%] text-4xl text-stroke-md sm:left-12 sm:text-7xl sm:text-stroke-lg">
          GAME
        </span>
        <span className="absolute right-14 top-[25%] text-4xl text-stroke-md sm:right-12 sm:text-7xl sm:text-stroke-lg">
          ENDS
        </span>

        {renderPlayers(firstPlacePlayers, 'first')}
        {renderPlayers(secondPlacePlayers, 'second')}
        {renderPlayers(thirdPlacePlayers, 'third')}
      </section>
    </div>
  );
};

export default ResultPage;
