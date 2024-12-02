import { useEffect } from 'react';
import Background from '@/components/ui/BackgroundCanvas';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { PixelTransitionContainer } from '@/components/ui/PixelTransitionContainer';
import { useCreateRoom } from '@/hooks/useCreateRoom';
import { usePageTransition } from '@/hooks/usePageTransition';
import { cn } from '@/utils/cn';

const MainPage = () => {
  const { createRoom, isLoading } = useCreateRoom();
  const { isExiting, transitionTo } = usePageTransition();

  useEffect(() => {
    // 현재 URL을 루트로 변경
    window.history.replaceState(null, '', '/');
  }, []);

  const handleCreateRoom = async () => {
    // transitionTo(`/lobby/${roomId}`);
    const response = await createRoom();
    if (response && response.roomId) {
      transitionTo(`/lobby/${response.roomId}`);
    }
  };

  return (
    <PixelTransitionContainer isExiting={isExiting}>
      <main
        className={cn(
          'relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-4 sm:gap-16',
          isExiting ? 'bg-transparent' : 'bg-gradient-to-b from-violet-950 via-violet-800 to-fuchsia-700',
        )}
      >
        <Background
          className={cn(
            'before:contents-[""] absolute -z-10 h-full w-full before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-patternImg before:bg-cover before:bg-center',
          )}
        />
        <div className="duration-1000 animate-in fade-in slide-in-from-top-8">
          <Logo variant="main" className="w-full transition duration-300 hover:scale-110 hover:brightness-[1.12]" />
        </div>

        <Button
          onClick={() => void handleCreateRoom()}
          disabled={isLoading || isExiting}
          className="h-12 max-w-72 animate-pulse"
        >
          {isLoading || isExiting ? '방 생성중...' : '방 만들기'}
        </Button>
      </main>
    </PixelTransitionContainer>
  );
};

export default MainPage;
