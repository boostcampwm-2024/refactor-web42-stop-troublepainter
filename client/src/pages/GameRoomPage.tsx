import { useEffect, useState } from 'react';
import { PlayerRole } from '@troublepainter/core';
import { GameCanvas } from '@/components/canvas/GameCanvas';
import { Modal } from '@/components/ui/Modal';
import { QuizTitle } from '@/components/ui/QuizTitle';
import { PLAYING_ROLE_TEXT } from '@/constants/gameConstant';
import { useModal } from '@/hooks/useModal';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const GameRoomPage = () => {
  const [remainingTime] = useState(30);
  const { isModalOpened, closeModal, handleKeyDown, openModal } = useModal(3000);
  const { players, currentPlayerId, room, roomSettings } = useGameSocketStore();

  const myRole = players.find((player) => player.playerId === currentPlayerId)?.role || null;

  useEffect(() => {
    if (myRole) openModal();
  }, [myRole, room?.currentRound]);

  if (!room || !players || !currentPlayerId || !roomSettings || !myRole) return null;

  return (
    <>
      {/* 역할 모달 */}
      <Modal
        title="역할 배정"
        isModalOpened={isModalOpened}
        closeModal={closeModal}
        handleKeyDown={handleKeyDown}
        className="w-80"
      >
        <span className="flex min-h-28 items-center justify-center text-3xl text-violet-950">
          {PLAYING_ROLE_TEXT[myRole]}
        </span>
      </Modal>

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
