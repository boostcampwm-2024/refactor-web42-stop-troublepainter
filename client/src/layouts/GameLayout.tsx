import { Outlet } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

const GameLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-violet-950 via-violet-800 to-fuchsia-800">
      {/* 상단 헤더 */}
      <header className="flex justify-center p-4">
        <Logo variant="side" className="" />
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="aspect-[16/9] w-full max-w-[1200px] overflow-hidden rounded-lg bg-eastbay-900/80">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default GameLayout;
