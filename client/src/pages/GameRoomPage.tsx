import { PlayerRole } from '@troublepainter/core';
import { GameCanvas } from '@/components/canvas/GameCanvas';
import RoleModal from '@/components/modal/RoleModal';
import { QuizTitle } from '@/components/ui/QuizTitle';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const GameRoomPage = () => {
  const { players, room, roomSettings, timer: drawingTimer } = useGameSocketStore();

  if (!room || !players || !roomSettings || !room.currentWord) return null;

  return (
    <>
      <RoleModal />
      {/* 중앙 영역 - 게임 화면 */}
      <QuizTitle
        currentRound={room.currentRound}
        totalRound={roomSettings.totalRounds}
        title={room.currentWord}
        remainingTime={drawingTimer ?? roomSettings.drawTime - 5}
      />
      <GameCanvas role={PlayerRole.PAINTER} maxPixels={100000} />
    </>
  );
};

export default GameRoomPage;
