/**
 * 두 타이머 값의 차이가 주어진 임계값 이상인지 확인합니다.
 *
 * @remarks
 * - 타이머 값의 차이는 절대값으로 계산됩니다.
 * - 임계값 이상이면 `true`, 그렇지 않으면 `false`를 반환합니다.
 *
 * @example
 * ```typescript
 * const isDifferenceExceeded = checkTimerDifference(10, 5, 3);
 * console.log(isDifferenceExceeded); // true
 *
 * const isDifferenceExceeded = checkTimerDifference(10, 8, 3);
 * console.log(isDifferenceExceeded); // false
 * ```
 *
 * @param time1 - 첫 번째 타이머 값 (초 단위)
 * @param time2 - 두 번째 타이머 값 (초 단위)
 * @param threshold - 두 타이머 값 차이에 대한 임계값
 *
 * @returns 두 타이머 값의 차이가 임계값 이상인지 여부를 나타내는 `boolean`
 *
 * @category Utility
 */
export function checkTimerDifference(time1: number, time2: number, threshold: number) {
  const timeDifference = Math.abs(time1 - time2);
  return timeDifference >= threshold;
}
