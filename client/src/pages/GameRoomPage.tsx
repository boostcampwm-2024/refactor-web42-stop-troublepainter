import { useEffect, useMemo, useState } from 'react';
import { PlayerRole } from '@troublepainter/core';
import { GameCanvas } from '@/components/canvas/GameCanvas';
import RoleModal from '@/components/modal/RoleModal';
import RoundEndModal from '@/components/modal/RoundEndModal';
import { QuizTitle } from '@/components/ui/QuizTitle';
import { useTimer } from '@/hooks/useTimer';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const GameRoomPage = () => {
  const { players, room, roomSettings, roundAssignedRole } = useGameSocketStore();
  const [showCanvas, setShowCanvas] = useState(false);
  const timers = useTimer();

  const handleDrawingReveal = (value: boolean) => {
    setShowCanvas(value);
  };

  useEffect(() => {
    if (room?.status === 'DRAWING') {
      setShowCanvas(roundAssignedRole === PlayerRole.PAINTER || roundAssignedRole === PlayerRole.DEVIL);
    } else if (room?.status === 'GUESSING') {
      setShowCanvas(true);
    }
  }, [room?.status, roundAssignedRole]);

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
      {showCanvas && (
        <GameCanvas
          currentRound={room.currentRound}
          roomStatus={room.status}
          role={roundAssignedRole || PlayerRole.GUESSER}
          maxPixels={100000}
          handleDrawingReveal={handleDrawingReveal}
        />
      )}
    </>
  );
};

export default GameRoomPage;
