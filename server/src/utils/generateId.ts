import type { nanoid as NanoIdType } from 'nanoid';

let nanoidPromise: Promise<typeof NanoIdType> | null = null;
let nanoid: typeof NanoIdType | null = null;

// Lazy initialization
const getNanoid = async () => {
  if (nanoid) return nanoid;

  if (!nanoidPromise) {
    nanoidPromise = import('nanoid').then((module) => {
      nanoid = module.nanoid;
      return nanoid;
    });
  }

  return nanoidPromise;
};

export type PlayerId = `p_${string}`;
export type RoomId = `r_${string}`;

/**
 * 플레이어의 고유 식별자를 생성하는 유틸리티 함수입니다.
 *
 * - nanoid를 사용해 충분한 무작위성과 고유성을 보장합니다.
 * - 'p_' 접두사와 36자리 nanoid 조합으로 구성됩니다.
 * - URL-safe 문자만을 사용합니다 (A-Za-z0-9_-)
 *
 * @returns 'p_' 접두사가 붙은 38자리 문자열 (p_ + 36자리 nanoid)
 *
 * @example
 * ```typescript
 * const playerId = generatePlayerId();
 * console.log(playerId); // "p_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
 * ```
 *
 * @category Utils
 */
export const generatePlayerId = async (): Promise<PlayerId> => {
  const nanoidFn = await getNanoid();
  return `p_${nanoidFn(36)}` as PlayerId;
};

/**
 * 게임 방의 고유 식별자를 생성하는 유틸리티 함수입니다.
 *
 * - nanoid를 사용해 충분한 무작위성과 고유성을 보장합니다.
 * - 'r_' 접두사와 8자리 nanoid 조합으로 구성됩니다.
 * - URL-safe 문자만을 사용합니다 (A-Za-z0-9_-)
 * - 짧은 길이로 사용자 편의성을 고려했습니다
 *
 * @returns 'r_' 접두사가 붙은 10자리 문자열 (r_ + 8자리 nanoid)
 *
 * @example
 * ```typescript
 * const roomId = generateRoomId();
 * console.log(roomId); // "r_1a2b3c4d"
 * ```
 *
 * @category Utils
 */
export const generateRoomId = async (): Promise<RoomId> => {
  const nanoidFn = await getNanoid();
  return `r_${nanoidFn(8)}` as RoomId;
};
