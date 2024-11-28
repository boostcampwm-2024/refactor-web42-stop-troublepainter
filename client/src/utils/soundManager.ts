/**
 * 애플리케이션의 사운드 재생을 관리하는 클래스입니다.
 *
 * @remarks
 * - 싱글턴 패턴을 사용하여 인스턴스가 하나만 존재하도록 보장합니다.
 * - 효율적인 재생을 위해 사운드를 미리 로드합니다.
 * - 자동 재생 제한을 우아하게 처리합니다.
 *
 * @example
 * ```typescript
 * const soundManager = SoundManager.getInstance();
 * soundManager.preloadSound(SOUND_IDS.ENTRY, 'path/to/entry-sound.mp3');
 * await soundManager.playSound(SOUND_IDS.ENTRY, 0.5);
 * ```
 */
export class SoundManager {
  private static instance: SoundManager;
  private audioMap: Map<string, HTMLAudioElement> = new Map();

  private constructor() {}

  /**
   * SoundManager의 싱글턴 인스턴스를 가져옵니다.
   *
   * @returns SoundManager 인스턴스
   */
  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * 나중에 재생할 사운드를 미리 로드합니다.
   *
   * @param id - 사운드의 고유 식별자
   * @param src - 사운드 파일의 소스 URL
   */
  preloadSound(id: string, src: string): void {
    if (!this.audioMap.has(id)) {
      const audio = new Audio(src);
      audio.load(); // 미리 로드
      this.audioMap.set(id, audio);
    }
  }

  /**
   * 미리 로드된 사운드를 재생합니다.
   *
   * @param id - 재생할 사운드의 식별자
   * @param volume - 볼륨 레벨 (0.0에서 1.0), 기본값은 1입니다.
   * @returns 사운드가 재생되기 시작할 때까지 해결되는 Promise
   *
   * @remarks
   * - 재생이 끝나면 오디오를 처음으로 되감습니다.
   * - 자동 재생 제한을 처리하고 적절한 메시지를 로그로 남깁니다.
   */
  async playSound(id: string, volume = 1): Promise<void> {
    const audio = this.audioMap.get(id);
    if (!audio) return;

    try {
      audio.volume = volume;
      await audio.play();
      // 재생이 끝나면 처음으로 되감기
      audio.currentTime = 0;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          console.info('브라우저 정책에 의해 사운드 자동 재생이 차단되었습니다.');
        } else {
          console.error('사운드 재생 오류:', error);
        }
      }
    }
  }
}

/**
 * 사운드 식별자를 포함하는 상수 객체입니다.
 *
 * @example
 * ```typescript
 * soundManager.preloadSound(SOUND_IDS.ENTRY, '@/assets/sounds/entry-sound-effect.mp3');
 * ```
 */
export const SOUND_IDS = {
  ENTRY: 'entry',
} as const;
