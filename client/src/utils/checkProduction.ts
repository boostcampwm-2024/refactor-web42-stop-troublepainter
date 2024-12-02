/**
 * 현재 환경이 프로덕션인지 확인하는 유틸리티 함수입니다.
 *
 * @remarks
 * - window.location.origin을 기준으로 프로덕션 환경을 판단합니다.
 * - troublepainter.site 도메인이 포함되어 있으면 프로덕션으로 간주합니다.
 * 
 * @returns 프로덕션 환경 여부를 나타내는 boolean 값
 * 
 * @example
 * ```typescript
 * if (isProduction()) {
 *   // 프로덕션 환경에서만 실행될 코드
 * }
 * ```
 * 
 * @category Utils
 */
export const checkProduction = () => {
  const PRODUCTION_URL = 'troublepainter.site';
  return window.location.origin.includes(PRODUCTION_URL);
};