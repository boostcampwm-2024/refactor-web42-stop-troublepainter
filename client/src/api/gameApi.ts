import { API_CONFIG, fetchApi } from './api.config';

export interface CreateRoomResponse {
  roomId: string;
}

export const gameApi = {
  createRoom: () => fetchApi<CreateRoomResponse>(API_CONFIG.ENDPOINTS.GAME.CREATE_ROOM, { method: 'POST' }),
};
