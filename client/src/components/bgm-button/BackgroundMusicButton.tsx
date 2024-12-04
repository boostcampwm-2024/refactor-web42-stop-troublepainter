import { useState } from 'react';
import soundLogo from '@/assets/sound-logo.svg';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { cn } from '@/utils/cn';

export const BackgroundMusicButton = () => {
  const { volume, togglePlay, adjustVolume } = useBackgroundMusic();
  const [isHovered, setIsHovered] = useState(false);

  const isMuted = volume === 0;

  return (
    <div
      className="fixed left-4 top-4 z-30 flex items-center gap-2 xs:left-8 xs:top-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 음소거/재생 토글 버튼 */}
      <button
        onClick={togglePlay}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full bg-chartreuseyellow-600 text-white transition-colors hover:bg-chartreuseyellow-500',
          isMuted && 'opacity-50 grayscale',
        )}
        aria-label={isMuted ? '배경음악 재생' : '배경음악 음소거'}
      >
        <img src={soundLogo} alt="배경음악 토글 버튼" className="h-8 w-8 transition-all duration-300" />
      </button>

      {/* 볼륨 슬라이더 */}
      <div
        className={cn(
          'flex flex-col items-center rounded-lg bg-chartreuseyellow-500 p-2 transition-all duration-300',
          isHovered ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-4 opacity-0',
        )}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => adjustVolume(Number(e.target.value))}
          className="h-1 w-24 appearance-none rounded-full bg-chartreuseyellow-200"
          aria-label="배경음악 볼륨 조절"
        />
      </div>
    </div>
  );
};

export default BackgroundMusicButton;
