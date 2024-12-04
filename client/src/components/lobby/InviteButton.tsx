import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useShortcuts } from '@/hooks/useShortcuts';
import { useToastStore } from '@/stores/toast.store';
import { cn } from '@/utils/cn';

export const InviteButton = () => {
  const [copied, setCopied] = useState(false);
  const actions = useToastStore((state) => state.actions);

  const handleCopyInvite = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      actions.addToast({
        title: '초대 링크 복사',
        description: '친구에게 링크를 공유해 방에 초대해보세요!',
        variant: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error(error);
      actions.addToast({
        title: '복사 실패',
        description: '나중에 다시 시도해주세요.',
        variant: 'error',
      });
    }
  };

  // 게임 초대 단축키 적용
  useShortcuts([
    {
      key: 'GAME_INVITE',
      action: () => void handleCopyInvite(),
    },
  ]);

  return (
    <Button
      onClick={() => void handleCopyInvite()}
      className={cn(
        'relative h-full overflow-hidden rounded-none border-0 bg-halfbaked-400 text-xl hover:bg-halfbaked-500',
        'sm:rounded-2xl sm:border-2 lg:text-2xl',
      )}
    >
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-halfbaked-500',
          'transition-transform duration-300',
          copied ? 'translate-y-0' : 'translate-y-14',
        )}
      >
        복사 완료!
      </span>
      <span
        className={cn('flex gap-2 transition-transform duration-300', copied ? '-translate-y-14' : 'translate-y-0')}
      >
        <div className="mt-0.5">🔗</div> 초대
      </span>
    </Button>
  );
};

export default InviteButton;
