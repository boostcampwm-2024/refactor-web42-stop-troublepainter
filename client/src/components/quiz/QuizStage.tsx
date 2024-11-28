import { useMemo } from 'react';
import { PlayerRole } from '@troublepainter/core';
import { GameCanvas } from '../canvas/GameCanvas';
import { QuizTitle } from '../ui/QuizTitle';
import sizzlingTimer from '@/assets/big-timer.gif';
import { useTimer } from '@/hooks/useTimer';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { cn } from '@/utils/cn';

const QuizGameContent = () => {
  const { room, roomSettings, roundAssignedRole } = useGameSocketStore();

  if (!room || !roomSettings) return null;

  const timers = useTimer();

  const shouldHideCanvas = useMemo(() => {
    const isGuesser = roundAssignedRole === PlayerRole.GUESSER;
    const isDrawing = room?.status === 'DRAWING';
    return isGuesser && isDrawing;
  }, [roundAssignedRole, room?.status]);

  const shouldHideQuizTitle = useMemo(() => {
    const isGuesser = roundAssignedRole === PlayerRole.GUESSER;
    const isDrawing = room?.status === 'DRAWING';
    return isGuesser && isDrawing;
  }, [roundAssignedRole, room?.status]);

  const shouldHideSizzlingTimer = useMemo(() => {
    const isPainters = roundAssignedRole === PlayerRole.DEVIL || roundAssignedRole === PlayerRole.PAINTER;
    const isDrawing = room?.status === 'DRAWING';
    const isGuessing = room?.status === 'GUESSING';
    return (isPainters && isDrawing) || isGuessing;
  }, [roundAssignedRole, room?.status]);

  const remainingTime = useMemo(() => {
    switch (room?.status) {
      case 'DRAWING':
        return timers.DRAWING ?? roomSettings?.drawTime;
      case 'GUESSING':
        return timers.GUESSING ?? 15;
      default:
        return 0;
    }
  }, [room?.status, timers, roomSettings?.drawTime]);
  return (
    <>
      <QuizTitle
        currentRound={room.currentRound}
        totalRound={roomSettings.totalRounds}
        title={room?.currentWord || (roundAssignedRole === PlayerRole.GUESSER ? '맞춰보세용-!' : '')}
        remainingTime={remainingTime || 0}
        isHidden={shouldHideQuizTitle}
      />
      <GameCanvas
        currentRound={room.currentRound}
        roomStatus={room.status}
        role={roundAssignedRole || PlayerRole.GUESSER}
        maxPixels={100000}
        isHidden={shouldHideCanvas}
      />

      <div className={cn('relative', shouldHideSizzlingTimer && 'hidden')}>
        <img src={sizzlingTimer} alt="타이머" width={450} />
        <span className="absolute left-[42%] top-[45%] text-6xl text-stroke-md lg:text-7xl">
          {timers.DRAWING ?? roomSettings.drawTime - 5}
        </span>
      </div>
    </>
  );
};

export default QuizGameContent;
