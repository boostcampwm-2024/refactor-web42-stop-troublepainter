import { Outlet } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { useGameSocket } from '@/core/socket/useGameSocket';

const GameLayout = () => {
  const { isConnected } = useGameSocket();

  // 연결 상태에 따른 로딩 표시
  if (!isConnected) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex h-96 w-96 animate-spin items-center justify-center text-5xl text-stroke-md">
          연결 중...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-start bg-gradient-to-b from-violet-950 via-violet-800 to-fuchsia-800 lg:py-5">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-center">
        <Logo variant="side" />
      </header>

      <main className="mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default GameLayout;
