import { Logo } from '@/components/ui/Logo';
import { useNavigationModalStore } from '@/stores/navigationModal.store';

const GameHeader = () => {
  const { openModal } = useNavigationModalStore((state) => state.actions);

  return (
    <header className="z-10 flex items-center justify-center">
      <button
        onClick={openModal}
        className="transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      >
        <Logo variant="side" />
      </button>
    </header>
  );
};

export default GameHeader;
