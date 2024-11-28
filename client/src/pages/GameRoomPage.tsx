import { useMemo } from 'react';
import { PlayerRole } from '@troublepainter/core';
import { GameCanvas } from '@/components/canvas/GameCanvas';
import RoleModal from '@/components/modal/RoleModal';
import RoundEndModal from '@/components/modal/RoundEndModal';
import { QuizTitle } from '@/components/ui/QuizTitle';
import { useTimer } from '@/hooks/useTimer';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const GameRoomPage = () => {
  const { players, room, roomSettings } = useGameSocketStore();
  const timers = useTimer();

  const remainingTime = useMemo(() => {
    switch (room?.status) {
      case 'DRAWING':
        return timers.DRAWING ?? roomSettings?.drawTime;
      case 'GUESSING':
        return timers.GUESSING ?? 10;
      default:
        return 0;
    }
  }, [room?.status, timers, roomSettings?.drawTime]);

  if (!room || !players || !roomSettings) return null;
  return (
    <>
      <RoleModal />
      <RoundEndModal />
      <QuizTitle
        currentRound={room.currentRound}
        totalRound={roomSettings.totalRounds}
        title={room?.currentWord || '구경꾼이라 안보임'}
        remainingTime={remainingTime || 0}
      />
      <GameCanvas role={PlayerRole.PAINTER} maxPixels={100000} />
    </>
  );
};

export default GameRoomPage;
