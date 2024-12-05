import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { PlayerRole, RoomStatus } from '@troublepainter/core';
import roundLoss from '@/assets/lottie/round-loss.lottie';
import roundWin from '@/assets/lottie/round-win.lottie';
import gameLoss from '@/assets/sounds/game-loss.mp3';
import gameWin from '@/assets/sounds/game-win.mp3';
import { Modal } from '@/components/ui/Modal';
import { useModal } from '@/hooks/useModal';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { useTimerStore } from '@/stores/timer.store';
import { cn } from '@/utils/cn';
import { SOUND_IDS, SoundManager } from '@/utils/soundManager';

const RoundEndModal = () => {
  const room = useGameSocketStore((state) => state.room);
  const roundWinners = useGameSocketStore((state) => state.roundWinners);
  const players = useGameSocketStore((state) => state.players);
  const currentPlayerId = useGameSocketStore((state) => state.currentPlayerId);
  const timer = useTimerStore((state) => state.timers.ENDING);

  const { isModalOpened, openModal, closeModal } = useModal();
  const [showAnimation, setShowAnimation] = useState(false);
  const [isAnimationFading, setIsAnimationFading] = useState(false);

  const devil = players.find((player) => player.role === PlayerRole.DEVIL);
  const isDevilWin = roundWinners?.some((winner) => winner.role === PlayerRole.DEVIL);
  const isCurrentPlayerWinner = roundWinners?.some((winner) => winner.playerId === currentPlayerId);

  // 컴포넌트 마운트 시 사운드 미리 로드
  const soundManager = SoundManager.getInstance();
  useEffect(() => {
    soundManager.preloadSound(SOUND_IDS.WIN, gameWin);
    soundManager.preloadSound(SOUND_IDS.LOSS, gameLoss);
  }, [soundManager]);

  useEffect(() => {
    if (roundWinners) {
      setIsAnimationFading(false);
      setShowAnimation(true);
      openModal();

      if (isCurrentPlayerWinner) {
        void soundManager.playSound(SOUND_IDS.WIN, 0.3);
      } else {
        void soundManager.playSound(SOUND_IDS.LOSS, 0.3);
      }
    }
  }, [roundWinners]);

  useEffect(() => {
    if (room && room.status === RoomStatus.DRAWING) closeModal();
  }, [room]);

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
              'absolute left-1/2 top-1/2 z-[999] h-screen w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500',
              isAnimationFading && 'opacity-0',
            )}
          />
        ) : (
          <DotLottieReact
            src={roundLoss}
            autoplay
            loop
            className={cn(
              'absolute left-1/2 top-[60%] z-[999] h-[50vh] w-full -translate-x-1/2 -translate-y-1/2 opacity-70 transition-opacity duration-500',
              isAnimationFading && 'opacity-0',
            )}
          />
        ))}

      <Modal
        title={room?.currentWord || ''}
        isModalOpened={isModalOpened}
        className="max-w-[26.875rem] sm:max-w-[61.75rem]"
      >
        <div className="relative flex min-h-[12rem] items-center justify-center sm:min-h-[15.75rem]">
          <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-violet-300 text-base text-violet-300">
            {timer}
          </span>
          <p className="text-center text-2xl sm:m-2 sm:text-3xl">
            {isDevilWin ? (
              <> 정답을 맞춘 구경꾼이 없습니다</>
            ) : (
              <>
                구경꾼{' '}
                <span className="text-violet-600">
                  {roundWinners?.find((winner) => winner.role === PlayerRole.GUESSER)?.nickname}
                </span>
                이(가) 정답을 맞혔습니다
              </>
            )}
          </p>
        </div>
        <div className="min-h-[4rem] rounded-md bg-violet-50 p-4 sm:m-2">
          <p className="text-center text-xl text-violet-950 sm:text-2xl">
            방해꾼은 <span className="text-violet-600">{devil?.nickname}</span>였습니다.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default RoundEndModal;
