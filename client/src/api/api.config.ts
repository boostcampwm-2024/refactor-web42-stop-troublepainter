// 서버 URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    GAME: {
      CREATE_ROOM: '/game/rooms',
    },
  },
  OPTIONS: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
} as const;

// 에러 객체
export class ApiError extends Error {
  constructor(
    public status: number,
    public data?: unknown,
    message?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API 요청을 보내고 응답을 처리하는 유틸리티 함수입니다.
 *
 * @template T - 응답 데이터의 타입
 * @param {string} endpoint - API 엔드포인트 경로 (예: '/game/rooms')
 * @param {RequestInit} [options] - fetch API의 옵션들
 *   - method: HTTP 메서드 (GET, POST 등)
 *   - headers: 요청 헤더
 *   - body: 요청 본문
 *   - 기타 fetch API 옵션들
 *
 * @returns {Promise<T>} API 응답 데이터를 포함한 Promise
 *
 * @throws {ApiError} API 요청이 실패한 경우
 *   - status: HTTP 상태 코드
 *   - message: 에러 메시지
 *   - data: 추가 에러 데이터
 *
 * @example
 * // 기본 사용법
 * const data = await fetchApi<ApiResponse<CreateRoomResponse>>(
 *   API_CONFIG.ENDPOINTS.GAME.CREATE_ROOM,
 *   { method: 'POST' }
 * );
 *
 * // 요청 본문이 있는 경우
 * const data = await fetchApi<ApiResponse<UpdateRoomResponse>>(
 *   API_CONFIG.ENDPOINTS.GAME.UPDATE_ROOM,
 *   {
 *     method: 'PUT',
 *     body: JSON.stringify({ maxPlayers: 5 })
 *   }
 * );
 *
 * // 에러 처리: 방 생성 함수
 * const createRoom = async (): Promise<CreateRoomResponse | undefined> => {
 *   setIsLoading(true);
 *   try {
 *     const response = await gameApi.createRoom();
 *
 *     // 성공 토스트 메시지
 *     // actions.addToast({
 *     //   title: '방 생성 성공',
 *     //   description: `방이 생성됐습니다! 초대 버튼을 눌러 초대 후 게임을 즐겨보세요!`,
 *     //   variant: 'success',
 *     // });
 *
 *     return response;
 *   } catch (error) {
 *     if (error instanceof ApiError) {
 *       // 에러 토스트 메시지
 *       actions.addToast({
 *         title: '방 생성 실패',
 *         description: error.message,
 *         variant: 'error',
 *       });
 *       console.error(error);
 *     }
 *   } finally {
 *     setIsLoading(false);
 *   }
 * };
 */
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...API_CONFIG.OPTIONS,
    ...options,
    headers: {
      ...API_CONFIG.OPTIONS.headers,
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data;
}
