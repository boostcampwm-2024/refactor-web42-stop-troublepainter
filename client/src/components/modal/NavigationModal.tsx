import { KeyboardEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useNavigationModalStore } from '@/stores/navigationModal.store';

export const NavigationModal = () => {
  const navigate = useNavigate();
  const { isOpen, actions } = useNavigationModalStore();

  const handleConfirmExit = () => {
    actions.closeModal();
    navigate('/', { replace: true });
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<Element>) => {
      switch (e.key) {
        case 'Enter':
          handleConfirmExit();
          break;
        case 'Escape':
          actions.closeModal();
          break;
      }
    },
    [actions, navigate],
  );

  return (
    <Modal
      title="게임 나가기"
      isModalOpened={isOpen}
      closeModal={actions.closeModal}
      className="min-w-72 max-w-sm lg:max-w-md xl:max-w-lg"
      handleKeyDown={handleKeyDown}
      aria-label="게임 나가기 확인 모달"
    >
      <div className="flex flex-col gap-4">
        <p className="text-center text-violet-950 lg:text-lg xl:text-xl">
          정말 게임을 나가실거에요...??
          <br />
          퇴장하면 다시 돌아오기 힘들어요! 🥺💔
        </p>
        <div className="flex gap-4" role="group" aria-label="게임 나가기 선택">
          <Button
            onClick={actions.closeModal}
            variant="primary"
            className="h-12 flex-1 text-base md:text-lg"
            aria-label="게임에 머물기"
          >
            안나갈래요!
          </Button>
          <Button
            onClick={handleConfirmExit}
            variant="primary"
            className="h-12 flex-1 bg-red-800 text-base hover:bg-red-600 md:text-lg"
            aria-label="게임 나가기 확인"
          >
            나갈래요..
          </Button>
        </div>
      </div>
    </Modal>
  );
};
