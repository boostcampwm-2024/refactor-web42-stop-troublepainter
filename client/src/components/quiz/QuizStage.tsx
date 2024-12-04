import { useMemo } from 'react';
import { PlayerRole, RoomStatus } from '@troublepainter/core';
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

  const quizTitleText = useMemo(() => {
    if (room.status === RoomStatus.DRAWING) {
      return roundAssignedRole !== PlayerRole.GUESSER ? `${room.currentWord}` : '';
    }
    if (room.status === RoomStatus.GUESSING) {
      return roundAssignedRole !== PlayerRole.GUESSER ? `${room.currentWord} (맞히는중...)` : '맞혀보세요-!';
    }
  }, [room.status, room.currentWord, roundAssignedRole]);

  return (
    <>
      {/* 구경꾼 전용 타이머 */}
      <div className={cn(shouldHideSizzlingTimer && 'hidden')}>
        <p className="mb-3 text-center text-xl text-eastbay-50 text-stroke-md sm:mb-0 sm:text-2xl lg:text-3xl">
          화가들이 실력을 뽐내는중...
        </p>
        <div className="relative">
          <img src={sizzlingTimer} alt="구경꾼 전용 타이머" width={450} />
          <span className="absolute left-[42%] top-[45%] text-6xl text-stroke-md lg:text-7xl">
            {timers.DRAWING ?? roomSettings.drawTime - 5}
          </span>
        </div>
      </div>

      <QuizTitle
        currentRound={room.currentRound}
        totalRound={roomSettings.totalRounds}
        title={quizTitleText || '제시어가 없습니다.'}
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
