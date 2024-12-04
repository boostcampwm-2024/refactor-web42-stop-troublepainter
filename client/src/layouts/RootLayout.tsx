import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BackgroundMusicButton from '@/components/bgm-button/BackgroundMusicButton';
import HelpContainer from '@/components/ui/HelpContainer';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';

const RootLayout = () => {
  // 레이아웃 마운트 시 localStorage 초기화
  useEffect(() => {
    playerIdStorageUtils.removeAllPlayerIds();
  }, []);

  return (
    <div className="relative min-h-screen min-w-80 bg-violet-950 bg-fixed antialiased">
      <BackgroundMusicButton />

      {/* 상단 네비게이션 영역: Help 아이콘 컴포넌트 */}
      <HelpContainer />

      {/* 메인 컨텐츠 */}
      <Outlet />
    </div>
  );
};

export default RootLayout;
