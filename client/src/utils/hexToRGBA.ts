/**
 * 16진수 색상 표기법(#000000)을 rgba 값을 담은 객체 구조로 반환하는 함수입니다.
 *
 * @param hex - 16진수 색상 표기법을 string 타입으로 받습니다. (#000 등 축약형은 사용할 수 없습니다)
 * @param alpha - 투명도입니다. 전달값이 없으면 자동으로 255가 채워집니다. (0: 투명, 255: 불투명)
 * @returns RGBA 객체
 *
 * @example
 * ```typescript
 * // 투명한 검은색
 * hexToRGBA('#000000', 0);
 *
 * // 불투명한 흰색
 * hexToRGBA('#ffffff', 255);
 * ```
 *
 * @category Utils
 */
export function hexToRGBA(hex: string, alpha = 255) {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b, a: alpha };
}
