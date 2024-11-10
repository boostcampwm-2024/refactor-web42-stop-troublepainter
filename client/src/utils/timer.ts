/**
 * 타이머 콜백 타입을 정의합니다.
 * `remainingTime`이 주어지면 남은 시간을 받아 처리할 수 있습니다.
 * @param remainingTime - 남은 시간(초) 또는 완료 콜백에서 사용되는 매개변수
 */
type TimerCallback = (remainingTime?: number) => void;

/**
 * 타이머 객체에 대한 인터페이스입니다.
 * `handleTick`은 타이머가 진행 중일 때마다 호출되고, `handleComplete`는 타이머가 완료될 때 호출됩니다.
 */
interface Timer {
  handleTick?: TimerCallback;
  handleComplete?: TimerCallback;
  delay: number;
}

/**
 * 현재 시간과 시작 시간, 지연 시간을 기준으로 남은 시간을 계산합니다.
 * @param currentTime - 현재 시간(밀리초 단위)
 * @param startTime - 타이머가 시작된 시간(밀리초 단위)
 * @param delay - 타이머의 전체 지속 시간(밀리초 단위)
 * @returns 남은 시간(초 단위)
 */
function calculateRemainingTime(currentTime: number, startTime: number, delay: number) {
  const elapsedTime = currentTime - startTime;
  return Math.ceil((delay - elapsedTime) / 1000);
}

/**
 * 주어진 콜백 함수를 실행합니다.
 * `remainingTime`이 있을 경우에는 해당 값을 전달하고, 그렇지 않으면 콜백을 그냥 실행합니다.
 * @param callback - 실행할 콜백 함수
 * @param remainingTime - 남은 시간(초) 값
 */
function executeCallback(callback: TimerCallback, remainingTime: number) {
  if (!callback) return;

  if (callback.length > 0) {
    callback(remainingTime);
  } else {
    callback();
  }
}

/**
 * 타이머를 실행하는 함수입니다.
 * `handleTick`과 `handleComplete` 콜백을 각각 타이머 진행 중과 완료 시 호출합니다.
 *
 * @param {Timer} param0 - 타이머 설정 객체
 * @param {number} param0.delay - 타이머의 전체 지속 시간(밀리초 단위)
 *
 * @returns {Function} 타이머를 취소하는 함수
 *
 * @example
 * export const useModal = (autoCloseDelay: number) => {
 *   const [isModalOpened, setModalOpened] = useState<boolean>(false);
 *
 *   const closeModal = () => {
 *     setModalOpened(false);
 *   };
 *
 *   const openModal = () => {
 *     setModalOpened(true);
 *     if (autoCloseDelay) {
 *       return timer({ handleComplete: closeModal, delay: autoCloseDelay });
 *     }
 *   };
 *
 * ...
 *
 *   return { openModal, closeModal, handleKeyDown, isModalOpened };
 * };
 *
 * @category Utils
 */
export function timer({ handleTick, handleComplete, delay }: Timer): () => void {
  const startTime = performance.now();
  let animationFrameId: number;

  const animate = (currentTime: number) => {
    const remainingTime = calculateRemainingTime(currentTime, startTime, delay);
    const isTimeEnd = currentTime - startTime >= delay;

    if (isTimeEnd) {
      if (handleComplete) executeCallback(handleComplete, remainingTime);
      if (handleTick) executeCallback(handleTick, remainingTime);
    } else {
      if (handleTick) executeCallback(handleTick, remainingTime);
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}
