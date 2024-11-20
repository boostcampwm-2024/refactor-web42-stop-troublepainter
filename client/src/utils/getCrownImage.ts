import crownFirst from '@/assets/crown-first.png';

/**
 * 순위에 따른 왕관 이미지를 반환하는 유틸리티 함수입니다.
 *
 * @remarks
 * 1~3위 플레이어의 프로필에 표시될 왕관 이미지를 순위별로 관리합니다.
 * 현재는 모든 순위가 동일한 이미지를 사용하지만, 추후 순위별 다른 이미지로 확장될 수 있습니다.
 *
 * @param rank - 플레이어의 순위 (0: 1등, 1: 2등, 2: 3등)
 * @returns 해당 순위의 왕관 이미지 경로
 *
 * @example
 * ```tsx
 * // PlayerCard.tsx에서의 사용 예시
 * const PlayerCard = ({ username, rank }) => {
 *   const crownImage = rank <= 2 ? getCrownImage(rank) : null;
 *
 *   return (
 *     <div>
 *       {crownImage && (
 *         <img
 *           src={crownImage}
 *           alt={`${rank + 1}등 사용자`}
 *           className="absolute -right-1 -top-3 h-7 w-auto"
 *         />
 *       )}
 *       <span>{username}</span>
 *     </div>
 *   );
 * };
 * ```
 *
 * @category Utils
 */
export default function getCrownImage(rank: 0 | 1 | 2) {
  const crownImages = {
    0: crownFirst,
    1: crownFirst,
    2: crownFirst,
  };
  return crownImages[rank];
}
