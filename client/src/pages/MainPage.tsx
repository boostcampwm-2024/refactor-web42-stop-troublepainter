import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { PixelTransitionContainer } from '@/components/ui/PixelTransitionContainer';
import { useCreateRoom } from '@/hooks/useCreateRoom';
import { usePageTransition } from '@/hooks/usePageTransition';
import { cn } from '@/utils/cn';

const MainPage = () => {
  const createRoomMutation = useCreateRoom();
  const { isExiting, transitionTo } = usePageTransition();

  const handleCreateRoom = async () => {
    // transitionTo(`/lobby/${roomId}`);
    const response = await createRoomMutation.mutateAsync();
    transitionTo(`/lobby/${response.roomId}`);
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

        <Button onClick={() => void handleCreateRoom()} disabled={createRoomMutation.isPending || isExiting}>
          {createRoomMutation.isPending || isExiting ? '방 생성중...' : '방 만들기'}
        </Button>
      </main>
    </PixelTransitionContainer>
  );
};

export default MainPage;
