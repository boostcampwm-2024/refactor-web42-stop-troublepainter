import { useEffect } from 'react';
import { PlayerRole } from '@troublepainter/core';
import { Modal } from '../ui/Modal';
import { useModal } from '@/hooks/useModal';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const RoundEndModal = () => {
  const { room, roundWinner, players, timers } = useGameSocketStore();
  const { isModalOpened, openModal, closeModal } = useModal();

  useEffect(() => {
    if (roundWinner) openModal();
  }, [roundWinner]);

  useEffect(() => {
    if (timers.ENDING === 0) closeModal();
  }, [timers.ENDING]);

  const devil = players.find((player) => player.role === PlayerRole.DEVIL);

  return (
    <Modal
      title={room?.currentWord || ''}
      isModalOpened={isModalOpened}
      className="max-w-[26.875rem] sm:max-w-[61.75rem]"
    >
      <div className="flex min-h-[12rem] items-center justify-center sm:min-h-[15.75rem]">
        <p className="text-center text-2xl sm:m-2 sm:text-3xl">
          {roundWinner?.role === PlayerRole.DEVIL ? (
            <> 정답을 맞춘 구경꾼이 없습니다</>
          ) : (
            <>
              구경꾼 <span className="text-violet-600">{roundWinner?.nickname}</span>이 정답을 맞혔습니다
            </>
          )}
        </p>
      </div>
      <div className="min-h-[4rem] rounded-md bg-violet-50 p-4 sm:m-2">
        <p className="text-center text-xl text-violet-950 sm:text-2xl">
          방해꾼은 <span className="text-violet-600">{devil?.nickname}</span>였습니다.
        </p>
        <span>{timers.ENDING}</span> {/* 임시 */}
      </div>
    </Modal>
  );
};

export default RoundEndModal;
