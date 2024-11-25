import { useState } from 'react';
import { PlayerRole } from '@troublepainter/core';
import { GameCanvas } from '@/components/canvas/GameCanvas';
import RoleModal from '@/components/modal/RoleModal';
import { QuizTitle } from '@/components/ui/QuizTitle';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const GameRoomPage = () => {
  const [remainingTime] = useState(30);
  const { players, currentPlayerId, room, roomSettings } = useGameSocketStore();

  if (!room || !players || !currentPlayerId || !roomSettings) return null;

  return (
    <>
      <RoleModal />
      {/* 중앙 영역 - 게임 화면 */}
      <QuizTitle
        currentRound={room.currentRound}
        totalRound={roomSettings.totalRounds}
        title="뭘까요?뭘까요?뭘까요?뭘까요?"
        remainingTime={remainingTime}
      />
      <GameCanvas role={PlayerRole.PAINTER} maxPixels={100000} />
    </>
  );
};

export default GameRoomPage;
