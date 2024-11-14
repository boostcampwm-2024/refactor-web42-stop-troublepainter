import { Outlet } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

const GameLayout = () => {
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
