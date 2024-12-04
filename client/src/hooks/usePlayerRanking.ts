import { useMemo } from 'react';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

/**
 * 플레이어 점수를 기준으로 상위 3위까지의 순위를 계산하고 반환하는 커스텀 훅입니다.
 *
 * 이 훅은 `useGameSocketStore`를 통해 플레이어 데이터를 가져온 뒤,
 * 점수가 0보다 큰 플레이어만 고려하여 1위, 2위, 3위 그룹으로 나눕니다.
 *
 * @returns {Object} 각 순위별 플레이어 그룹을 포함한 객체:
 * - `firstPlacePlayers`: 가장 높은 점수를 가진 플레이어 배열.
 * - `secondPlacePlayers`: 두 번째로 높은 점수를 가진 플레이어 배열.
 * - `thirdPlacePlayers`: 세 번째로 높은 점수를 가진 플레이어 배열.
 *
 * 각 배열은 해당 순위에 플레이어가 없을 경우 빈 배열로 반환됩니다.
 *
 * @example
 * // React 컴포넌트에서의 사용 예
 * const { firstPlacePlayers, secondPlacePlayers, thirdPlacePlayers } = usePlayerRankings();
 *
 * console.log('1위 플레이어:', firstPlacePlayers);
 * console.log('2위 플레이어:', secondPlacePlayers);
 * console.log('3위 플레이어:', thirdPlacePlayers);
 *
 * @category Hooks
 */

export const usePlayerRankings = () => {
  const players = useGameSocketStore((state) => state.players ?? []);

  const rankedPlayers = useMemo(() => {
    const validPlayers = players.filter((player) => player.score > 0);
    const sortedScores = [...new Set(validPlayers.map((p) => p.score))].sort((a, b) => b - a);
    return sortedScores.slice(0, 3).map((score) => validPlayers.filter((player) => player.score === score));
  }, [players]);

  return {
    firstPlacePlayers: rankedPlayers[0] ?? [],
    secondPlacePlayers: rankedPlayers[1] ?? [],
    thirdPlacePlayers: rankedPlayers[2] ?? [],
  };
};
