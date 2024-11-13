import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { PixelTransitionContainer } from '@/components/ui/PixelTransitionContainer';
import { usePageTransition } from '@/hooks/usePageTransition';
import { cn } from '@/utils/cn';

const MainPage = () => {
  const { isExiting, transitionTo } = usePageTransition();

  const handleCreateRoom = () => {
    // 서버 통신 로직이 들어갈 자리
    // const response = await createRoom();
    // const { roomId } = response.data;

    transitionTo('/waiting-room/123');
  };

  return (
    <PixelTransitionContainer isExiting={isExiting}>
      <main
        className={cn(
          'flex min-h-screen flex-col items-center justify-center gap-8 px-4 sm:gap-16',
          isExiting ? 'bg-transparent' : 'bg-gradient-to-b from-violet-950 via-violet-800 to-fuchsia-700',
        )}
      >
        <div className="duration-1000 animate-in fade-in slide-in-from-top-8">
          <Logo variant="main" className="w-full transition duration-300 hover:scale-110 hover:brightness-[1.12]" />
        </div>

        <Button onClick={handleCreateRoom} className="h-12 max-w-72 animate-pulse">
          방 만들기
        </Button>
      </main>
    </PixelTransitionContainer>
  );
};

export default MainPage;
