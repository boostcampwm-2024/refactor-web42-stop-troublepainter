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
  { playerId: 'my-id', nickname: '그림러그림러그그림러그림러그', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'd4e5f6', nickname: 'TroublepainterTroublepainter', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'g7h8i9', nickname: 'my-id', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'j1k2l3', nickname: '구경러2', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'm4n5o6', nickname: '그림러1', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'p7q8r9', nickname: '방해러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 's1t2u3', nickname: '구경러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'v4w5x6', nickname: '구경러2', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'y7z8a1', nickname: '그림러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'b2c3d4', nickname: '방해러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'e5f6g7', nickname: '구경러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'h8i9j1', nickname: '구경러2', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'k2l3m4', nickname: '그림러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'n5o6p7', nickname: '방해러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'q8r9s1', nickname: '구경러1', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 't2u3v4', nickname: '구경러2', status: PlayerStatus.READY, score: 0 },
  { playerId: 'w5x6y7', nickname: '그림러1', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'z8a1b2', nickname: '방해러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'c3d4e5', nickname: '구경러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'f6g7h8', nickname: '구경러2', status: PlayerStatus.NOT_READY, score: 0 },
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
