import { useCallback, useEffect } from 'react';
import { TerminationType } from '@troublepainter/core';
import { useNavigate } from 'react-router-dom';
import podium from '@/assets/podium.gif';
import PodiumPlayers from '@/components/result/PodiumPlayers';
import { usePlayerRankings } from '@/hooks/usePlayerRanking';
import { useTimeout } from '@/hooks/useTimeout';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { useToastStore } from '@/stores/toast.store';

const ResultPage = () => {
  const navigate = useNavigate();
  const roomId = useGameSocketStore((state) => state.room?.roomId);
  const terminateType = useGameSocketStore((state) => state.gameTerminateType);
  const gameActions = useGameSocketStore((state) => state.actions);
  const toastActions = useToastStore((state) => state.actions);
  const { firstPlacePlayers, secondPlacePlayers, thirdPlacePlayers } = usePlayerRankings();

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

  return (
    <section className="relative">
      <img src={podium} alt="" aria-hidden={true} className="w-[25rem] sm:w-[33.75rem]" />
      <span className="absolute left-14 top-[25%] text-4xl text-stroke-md sm:left-12 sm:text-7xl sm:text-stroke-lg">
        GAME
      </span>
      <span className="absolute right-14 top-[25%] text-4xl text-stroke-md sm:right-12 sm:text-7xl sm:text-stroke-lg">
        ENDS
      </span>

      <PodiumPlayers players={firstPlacePlayers} position="first" />
      <PodiumPlayers players={secondPlacePlayers} position="second" />
      <PodiumPlayers players={thirdPlacePlayers} position="third" />
    </section>
  );
};

export default ResultPage;
