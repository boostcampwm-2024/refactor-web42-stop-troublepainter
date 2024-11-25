import { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PLAYING_ROLE_TEXT } from '@/constants/gameConstant';
import { useModal } from '@/hooks/useModal';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const RoleModal = () => {
  const { players, currentPlayerId, room } = useGameSocketStore();
  const { isModalOpened, closeModal, handleKeyDown, openModal } = useModal(3000);

  const myRole = players.find((player) => player.playerId === currentPlayerId)?.role || null;

  if (!myRole) return null;

  useEffect(() => {
    if (myRole) openModal();
  }, [myRole, room?.currentRound]);

  return (
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
  );
};

export default RoleModal;
