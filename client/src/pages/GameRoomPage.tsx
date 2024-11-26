import { PlayerRole } from '@troublepainter/core';
import { GameCanvas } from '@/components/canvas/GameCanvas';
import RoleModal from '@/components/modal/RoleModal';
import { QuizTitle } from '@/components/ui/QuizTitle';
import { useTimer } from '@/hooks/useTimer';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const GameRoomPage = () => {
  const { players, room, roomSettings, timer: drawingTimer, actions } = useGameSocketStore();

  useTimer({ timer: drawingTimer, onTick: actions.decreaseTimer });

  if (!room || !players || !roomSettings || !room.currentWord) return null;
  return (
    <>
      <RoleModal />
      <QuizTitle
        currentRound={room.currentRound}
        totalRound={roomSettings.totalRounds}
        title={room.currentWord}
        remainingTime={drawingTimer ?? roomSettings.drawTime}
      />
      <GameCanvas role={PlayerRole.PAINTER} maxPixels={100000} />
    </>
  );
};

export default GameRoomPage;
