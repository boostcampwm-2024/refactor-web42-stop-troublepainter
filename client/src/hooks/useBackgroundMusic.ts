import { useCallback, useEffect, useRef, useState } from 'react';
import { CDN } from '@/constants/cdn';

/**
 * 배경 음악을 재생하고 제어하는 커스텀 훅입니다. 자동 재생 정책에 따라 초기 재생이 차단될 수 있으며, 이 경우 콘솔에 경고가 표시됩니다.
 *
 * @remarks
 * - 배경 음악을 자동으로 재생
 * - 음악의 재생 및 일시 정지 토글 가능
 * - 기본 볼륨은 0.5, 0.0에서 1.0 사이의 값으로 볼륨을 조절 가능
 *
 * @returns {Object} - 음악 제어를 위한 메서드를 포함하는 객체
 * @returns {Function} togglePlay - 음악의 재생 상태를 토글하는 함수
 * @returns {number} volume - 현재 볼륨 (0.0 ~ 1.0)
 * @returns {Function} adjustVolume - 볼륨을 조절하는 함수
 *
 *
 * @example
 * ```tsx
 * import { useBackgroundMusic } from './hooks/useBackgroundMusic';
 *
 * const MyComponent = () => {
 *   const { togglePlay, volume, adjustVolume } = useBackgroundMusic();
 *
 *   return (
 *     <div>
 *       <button onClick={togglePlay}>Toggle Background Music</button>
 *       <input
 *         type="range"
 *         min="0"
 *         max="1"
 *         step="0.1"
 *         value={volume}
 *         onChange={(e) => adjustVolume(Number(e.target.value))}
 *    />
 *     </div>
 *   );
 * };
 * ```
 */
export const useBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0); // 초기 볼륨 0으로 시작
  const previousVolume = useRef(0.5); // 이전 볼륨값 저장용 (기본값 0.5)

  useEffect(() => {
    audioRef.current = new Audio(CDN.BACKGROUND_MUSIC);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    const playAudio = async () => {
      if (!audioRef.current) return;
      try {
        // 자동 재생 시도
        await audioRef.current.play();
        // 자동 재생 성공하면 기본 볼륨(0.5)으로 설정
        setVolume(0.5);
      } catch (err) {
        // 자동 재생이 차단된 경우
        console.error('Auto-play prevented:', err);
      }
    };

    // 클릭 이벤트 핸들러
    const handleClick = () => {
      void playAudio();
      window.removeEventListener('click', handleClick); // 한 번만 실행
    };

    window.addEventListener('click', handleClick);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // 볼륨에 따른 재생/일시정지 처리
      if (volume === 0) {
        audioRef.current.pause();
      } else if (audioRef.current.paused) {
        void audioRef.current.play();
      }
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused || volume === 0) {
      // 재생 시작할 때는 이전 볼륨(또는 기본값 0.5)으로 설정
      const newVolume = previousVolume.current;
      setVolume(newVolume);
      void audioRef.current.play();
    } else {
      // 일시정지할 때는 현재 볼륨을 저장하고 0으로 설정
      previousVolume.current = volume;
      setVolume(0);
      audioRef.current.pause();
    }
  }, [volume]);

  const adjustVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);

    // 0이 아닌 볼륨값을 이전 볼륨으로 저장
    if (clampedVolume > 0) {
      previousVolume.current = clampedVolume;

      // 볼륨이 0보다 크면 음악을 재생
      if (audioRef.current && audioRef.current.paused) {
        void audioRef.current.play();
      }
    }
  }, []);

  return {
    togglePlay,
    volume,
    adjustVolume,
  };
};
