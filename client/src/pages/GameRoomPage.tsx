import { useState } from 'react';
import { GameCanvas } from '@/components/canvas/GameCanvasExample';
import { QuizTitle } from '@/components/ui/QuizTitle';
import GamePlayLayout from '@/layouts/GamePlayLayout';
import { Message } from '@/types/chat.types';
import { Player, PlayerRole, PlayerStatus } from '@/types/game.types';

const MOCK_MESSAGES: Message[] = [
  { id: 1, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 2, nickname: '참가자2', content: '반가워요~', isOthers: true },
  { id: 3, nickname: '', content: '안녕하세요 :)', isOthers: false },
  { id: 12, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  {
    id: 22,
    nickname: '참가자2',
    content: '반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~',
    isOthers: true,
  },
  { id: 32, nickname: '', content: '안녕하세요 :)', isOthers: false },
  { id: 123, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 223, nickname: '참가자2', content: '반가워요~', isOthers: true },
  { id: 323, nickname: '', content: '안녕하세요 :)', isOthers: false },
  { id: 1234, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 2234, nickname: '참가자2', content: '반가워요~', isOthers: true },
  { id: 3234, nickname: '', content: '안녕하세요 :)', isOthers: false },
  { id: 12345, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 22345, nickname: '참가자2', content: '반가워요~', isOthers: true },
  { id: 32345, nickname: '', content: '안녕하세요 :)', isOthers: false },
];

const MOCK_PARTICIPANTS: Player[] = [
  { playerId: '1', nickname: '구경러1', status: PlayerStatus.PLAYING, role: PlayerRole.GUESSER, score: 3 },
  { playerId: '2', nickname: '구경러2', status: PlayerStatus.PLAYING, role: PlayerRole.GUESSER, score: 2 },
  { playerId: '3', nickname: '그림러1', status: PlayerStatus.PLAYING, role: PlayerRole.PAINTER, score: 50 },
  { playerId: '4', nickname: '방해러1', status: PlayerStatus.PLAYING, role: PlayerRole.DEVIL, score: 40 },
];

const GameRoomPage = () => {
  const [remainingTime] = useState(30);

  return (
    <GamePlayLayout messages={MOCK_MESSAGES} players={MOCK_PARTICIPANTS}>
      {/* 중앙 영역 - 게임 화면 */}
      <QuizTitle currentRound={1} totalRound={4} title="뭘까요?뭘까요?뭘까요?뭘까요?" remainingTime={remainingTime} />
      <GameCanvas role={PlayerRole.PAINTER} maxPixels={100000} />
    </GamePlayLayout>
  );
};

export default GameRoomPage;
