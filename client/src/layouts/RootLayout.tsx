import { useEffect, MouseEvent } from 'react';
import { Outlet } from 'react-router-dom';
import helpIcon from '@/assets/help-icon.svg';
import BackgroundMusicButton from '@/components/bgm-button/BackgroundMusicButton';
import RollingModal from '@/components/modal/RollingModal';
import { Button } from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';

const RootLayout = () => {
  const { isModalOpened, closeModal, openModal, handleKeyDown } = useModal();

  // 레이아웃 마운트 시 localStorage 초기화
  useEffect(() => {
    playerIdStorageUtils.removeAllPlayerIds();
  }, []);

  const handleOpenHelpModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    openModal();
  };

  return (
    <div className="relative min-h-screen min-w-80 bg-violet-950 bg-fixed antialiased">
      <BackgroundMusicButton />
      {/* 상단 네비게이션 영역: Help 아이콘 컴포넌트 */}
      <nav className="fixed right-4 top-4 z-30 xs:right-8 xs:top-8">
        <Button variant="transperent" size="icon" onClick={handleOpenHelpModal}>
          <img src={helpIcon} alt="도움말 보기 버튼" />
        </Button>
        <RollingModal isModalOpened={isModalOpened} handle={{ closeModal, openModal, handleKeyDown }} />
      </nav>

      {/* 메인 컨텐츠 */}
      <Outlet />
    </div>
  );
};

export default RootLayout;
