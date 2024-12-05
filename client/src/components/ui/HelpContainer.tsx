import { MouseEvent } from 'react';
import helpIcon from '@/assets/help-icon.svg';
import HelpRollingModal from '@/components/modal/HelpRollingModal';
import { Button } from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';

const HelpContainer = ({}) => {
  const { isModalOpened, closeModal, openModal, handleKeyDown } = useModal();

  const handleOpenHelpModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    openModal();
  };
  return (
    <nav className="fixed right-4 top-4 z-30 xs:right-8 xs:top-8">
      <Button
        variant="transperent"
        size="icon"
        onClick={handleOpenHelpModal}
        aria-label="도움말 보기"
        className="hover:brightness-75"
      >
        <img src={helpIcon} alt="도움말 보기 버튼" />
      </Button>
      <HelpRollingModal isModalOpened={isModalOpened} handleCloseModal={closeModal} handleKeyDown={handleKeyDown} />
    </nav>
  );
};

export default HelpContainer;
