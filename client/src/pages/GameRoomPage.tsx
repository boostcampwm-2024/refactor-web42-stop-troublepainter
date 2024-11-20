import { useState } from 'react';
import { GameCanvas } from '@/components/canvas/GameCanvasExample';
import { QuizTitle } from '@/components/ui/QuizTitle';
import { PlayerRole } from '@/types/gameShared.types';

const GameRoomPage = () => {
  const [remainingTime] = useState(30);

  return (
    <>
      {/* 중앙 영역 - 게임 화면 */}
      <QuizTitle currentRound={1} totalRound={4} title="뭘까요?뭘까요?뭘까요?뭘까요?" remainingTime={remainingTime} />
      <GameCanvas role={PlayerRole.PAINTER} maxPixels={100000} />
    </>
  );
};

export default GameRoomPage;
