import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Outlet } from 'react-router-dom';
import loading from '@/assets/lottie/loading.lottie';
import { Chat } from '@/components/chat/Chat';
import { NavigationModal } from '@/components/modal/NavigationModal';
import { PlayerCardList } from '@/components/player/PlayerCardList';
import { useGameSocket } from '@/hooks/socket/useGameSocket';
import BrowserNavigationGuard from '@/layouts/BrowserNavigationGuard';
import GameHeader from '@/layouts/GameHeader';
import { cn } from '@/utils/cn';

const GameLayout = () => {
  const { isConnected } = useGameSocket();
  // console.log(players, room, roomSettings);

  // 연결 상태에 따른 로딩 표시
  if (!isConnected) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <DotLottieReact src={loading} loop autoplay className="h-96 w-96" />
      </div>
    );
  }

  return (
    <>
      <BrowserNavigationGuard />
      <NavigationModal />
      <div className="flex min-h-screen flex-col justify-start bg-gradient-to-b from-violet-950 via-violet-800 to-fuchsia-800 lg:py-5">
        {/* 상단 헤더 */}
        <GameHeader />

        <main className="mx-auto">
          <div
            className={cn(
              // 기본 스타일 (모바일, < 1024px)
              'relative flex h-[calc(100vh-5rem)] min-h-[50rem] w-screen flex-col items-start justify-start bg-eastbay-600 xs:h-[calc(100vh-6rem)]',
              // lg
              'lg:h-[calc(100vh-10rem)] lg:min-h-[29rem] lg:max-w-screen-lg lg:flex-row lg:rounded-lg lg:px-3',
              // xl
              'xl:min-h-[34rem] xl:max-w-screen-xl xl:rounded-xl',
              // 2xl
              '2xl:min-h-[35.5rem] 2xl:max-w-screen-2xl 2xl:rounded-2xl 2xl:px-5',
            )}
          >
            {/* 플레이어 정보 영역 */}
            <aside
              className={cn(
                // 모바일
                'flex h-24 w-full gap-0.5 overflow-x-scroll px-2 pt-2',
                // 데스크탑
                'lg:m-0 lg:mr-4 lg:h-full lg:w-3/12 lg:flex-col lg:gap-2 lg:overflow-x-auto lg:overflow-y-scroll',
                'lg:border-r-2 lg:border-dashed lg:border-violet-50 lg:p-0 lg:py-3 lg:pr-4',
                '2xl:-mr-5 2xl:py-5 2xl:pr-5',
              )}
              aria-label="플레이어 목록"
            >
              <PlayerCardList />
            </aside>

            {/* 중앙 영역 */}
            <section
              className={cn(
                'flex w-full flex-col items-center justify-center sm:gap-2',
                // 데스크톱
                'lg:w-6/12 lg:gap-4 lg:py-3 2xl:py-5',
              )}
            >
              <Outlet />
            </section>

            {/* 채팅 영역 */}
            <aside
              className={cn(
                'relative flex min-h-0 w-full flex-1 flex-col items-end px-2 pb-2 sm:h-full',
                // 데스크탑
                'lg:ml-4 lg:h-full lg:w-3/12 lg:border-l-2 lg:border-dashed lg:border-violet-50 lg:py-3 lg:pl-2 lg:pr-0',
                '2xl:-ml-5 2xl:py-5 2xl:pl-5',
              )}
            >
              <Chat />
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default GameLayout;
