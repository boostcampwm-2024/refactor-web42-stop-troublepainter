import { Button } from '@/components/ui/Button';
import { useGameStart } from '@/hooks/useStartButton';
import { cn } from '@/utils/cn';

export const StartButton = () => {
  const { isHost, buttonConfig, handleStartGame, isStarting } = useGameStart();
  return (
    <Button
      onClick={handleStartGame}
      disabled={buttonConfig.disabled || isStarting}
      title={buttonConfig.title}
      className={cn(
        'h-full rounded-none border-0 text-xl',
        'sm:rounded-2xl sm:border-2 lg:text-2xl',
        !isHost && 'cursor-not-allowed opacity-50 hover:bg-violet-500',
      )}
    >
      {isStarting ? '곧 게임이 시작됩니다!' : buttonConfig.content}
    </Button>
  );
};
