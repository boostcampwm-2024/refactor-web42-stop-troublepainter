import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { PlayerRole } from '@troublepainter/core';
import roundLoss from '@/assets/lottie/round-loss.lottie';
import roundWin from '@/assets/lottie/round-win.lottie';
import { Modal } from '@/components/ui/Modal';
import { useModal } from '@/hooks/useModal';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { cn } from '@/utils/cn';

const RoundEndModal = () => {
  const { room, roundWinner, players, timers, currentPlayerId } = useGameSocketStore();
  const { isModalOpened, openModal, closeModal } = useModal();
  const [showAnimation, setShowAnimation] = useState(false);
  const [isAnimationFading, setIsAnimationFading] = useState(false);

  useEffect(() => {
    if (roundWinner) {
      setIsAnimationFading(false);
      setShowAnimation(true);
      openModal();
    }
  }, [roundWinner]);

  useEffect(() => {
    if (timers.ENDING === 0) closeModal();
  }, [timers.ENDING]);

  const devil = players.find((player) => player.role === PlayerRole.DEVIL);
  const isDevilWin = roundWinner?.role === PlayerRole.DEVIL;
  const isCurrentPlayerWinner = currentPlayerId === roundWinner?.playerId;

  useEffect(() => {
    if (showAnimation) {
      // 3초 후에 페이드아웃 시작
      const fadeTimer = setTimeout(() => {
        setIsAnimationFading(true);
      }, 3000);

      // 3.5초 후에 컴포넌트 제거
      const removeTimer = setTimeout(() => {
        setShowAnimation(false);
      }, 3500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [showAnimation]);

  return (
    <>
      {/* 승리/패배 애니메이션 */}
      {showAnimation &&
        (isCurrentPlayerWinner ? (
          <DotLottieReact
            src={roundWin}
            autoplay
            loop={false}
            className={cn(
              'absolute left-1/2 top-1/2 z-50 h-screen w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500',
              isAnimationFading && 'opacity-0',
            )}
          />
        ) : (
          <DotLottieReact
            src={roundLoss}
            autoplay
            loop={false}
            className={cn(
              'absolute left-1/2 top-1/2 z-50 h-[50vh] w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500',
              isAnimationFading && 'opacity-0',
            )}
          />
        ))}

      <Modal
        title={room?.currentWord || ''}
        isModalOpened={isModalOpened}
        className="max-w-[26.875rem] sm:max-w-[61.75rem]"
      >
        <div className="flex min-h-[12rem] items-center justify-center sm:min-h-[15.75rem]">
          <p className="text-center text-2xl sm:m-2 sm:text-3xl">
            {isDevilWin ? (
              <> 정답을 맞춘 구경꾼이 없습니다</>
            ) : (
              <>
                구경꾼 <span className="text-violet-600">{roundWinner?.nickname}</span>이 정답을 맞혔습니다
              </>
            )}
          </p>
        </div>
        <div className="min-h-[4rem] rounded-md bg-violet-50 p-4 sm:m-2">
          <p className="text-center text-xl text-violet-950 sm:text-2xl">
            방해꾼은 <span className="text-violet-600">{devil?.nickname}</span>였습니다.
          </p>
          <span>{timers.ENDING}</span>
        </div>
      </Modal>
    </>
  );
};

export default RoundEndModal;
