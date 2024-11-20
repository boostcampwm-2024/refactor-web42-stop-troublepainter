/**
 * 플레이어 ID를 로컬 스토리지에서 관리하는 유틸리티입니다.
 *
 * @remarks
 * 각 방에 접속한 플레이어의 ID를 브라우저의 localStorage에 저장하고 관리합니다.
 * 이를 통해 페이지 새로고침이나 재접속 시에도 플레이어 식별이 가능합니다.
 *
 * @example
 * ```typescript
 * // 플레이어 ID 저장
 * playerIdStorageUtils.setPlayerId("room123", "player456");
 *
 * // 저장된 플레이어 ID 조회
 * const playerId = playerIdStorageUtils.getPlayerId("room123");
 *
 * // 방 퇴장 시 해당 방의 플레이어 ID 제거
 * playerIdStorageUtils.removePlayerId("room123");
 * ```
 *
 * @category Utils
 */

/** 로컬 스토리지에 사용되는 키 형식 정의 */
export const STORAGE_KEYS = {
  /**
   * 방 ID를 기반으로 플레이어 ID 스토리지 키를 생성합니다.
   * @param roomId - 방 식별자
   * @returns 스토리지 키 문자열
   */
  PLAYER_ID: (roomId: string) => `playerId_${roomId}`,
} as const;

export const playerIdStorageUtils = {
  /**
   * 특정 방의 플레이어 ID를 조회합니다.
   * @param roomId - 방 식별자
   * @returns 플레이어 ID 또는 null
   */
  getPlayerId: (roomId: string) => localStorage.getItem(STORAGE_KEYS.PLAYER_ID(roomId)),

  /**
   * 특정 방의 플레이어 ID를 저장합니다.
   * @param roomId - 방 식별자
   * @param playerId - 저장할 플레이어 ID
   */
  setPlayerId: (roomId: string, playerId: string) => localStorage.setItem(STORAGE_KEYS.PLAYER_ID(roomId), playerId),

  /**
   * 특정 방의 플레이어 ID를 삭제합니다.
   * @param roomId - 방 식별자
   */
  removePlayerId: (roomId: string) => localStorage.removeItem(STORAGE_KEYS.PLAYER_ID(roomId)),

  /**
   * 모든 방의 플레이어 ID를 삭제합니다.
   * @remarks
   * 주로 새로운 접속 시도나 전체 초기화가 필요할 때 사용됩니다.
   */
  removeAllPlayerIds: () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('playerId_'))
      .forEach((key) => localStorage.removeItem(key));
  },
};
