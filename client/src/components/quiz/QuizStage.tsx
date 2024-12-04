import { useMemo } from 'react';
import { PlayerRole } from '@troublepainter/core';
import { GameCanvas } from '../canvas/GameCanvas';
import { QuizTitle } from '../ui/QuizTitle';
import sizzlingTimer from '@/assets/big-timer.gif';
import { DEFAULT_MAX_PIXELS } from '@/constants/canvasConstants';
import { useTimer } from '@/hooks/useTimer';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { cn } from '@/utils/cn';

const QuizStageContainer = () => {
  const room = useGameSocketStore((state) => state.room);
  const roomSettings = useGameSocketStore((state) => state.roomSettings);
  const roundAssignedRole = useGameSocketStore((state) => state.roundAssignedRole);

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
      {/* 구경꾼 전용 타이머 */}
      <div className={cn('relative', shouldHideSizzlingTimer && 'hidden')}>
        <img src={sizzlingTimer} alt="구경꾼 전용 타이머" width={450} />
        <span className="absolute left-[42%] top-[45%] text-6xl text-stroke-md lg:text-7xl">
          {timers.DRAWING ?? roomSettings.drawTime - 5}
        </span>
      </div>

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
        maxPixels={DEFAULT_MAX_PIXELS}
        isHidden={shouldHideCanvas}
      />
    </>
  );
};

export default QuizStageContainer;
