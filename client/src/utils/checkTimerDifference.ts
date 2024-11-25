export function checkTimerDifference(time1: number, time2: number, threshold: number) {
  const timeDifference = Math.abs(time1 - time2);
  return timeDifference >= threshold;
}
