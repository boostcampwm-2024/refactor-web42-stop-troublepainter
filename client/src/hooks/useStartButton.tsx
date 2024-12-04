import { useCallback, useMemo, useState } from 'react';
import { gameSocketHandlers } from '@/handlers/socket/gameSocket.handler';
import { useShortcuts } from '@/hooks/useShortcuts';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

export const START_BUTTON_STATUS = {
  NOT_HOST: {
    title: '방장만 게임을 시작할 수 있습니다',
    content: '방장만 시작 가능',
    disabled: true,
  },
  NOT_ENOUGH_PLAYERS: {
    title: '게임을 시작하려면 최소 4명의 플레이어가 필요합니다',
    content: '4명 이상 게임 시작 가능',
    disabled: true,
  },
  CAN_START: {
    title: undefined,
    content: '게임 시작',
    disabled: false,
  },
} as const;

export const useGameStart = () => {
  const [isStarting, setIsStarting] = useState(false);

  const players = useGameSocketStore((state) => state.players);
  const isHost = useGameSocketStore((state) => state.isHost);
  const room = useGameSocketStore((state) => state.room);
  const currentPlayerId = useGameSocketStore((state) => state.currentPlayerId);

  const buttonConfig = useMemo(() => {
    if (!isHost) return START_BUTTON_STATUS.NOT_HOST;
    if (players.length < 4) return START_BUTTON_STATUS.NOT_ENOUGH_PLAYERS;
    return START_BUTTON_STATUS.CAN_START;
  }, [isHost, players.length]);

  const handleStartGame = useCallback(() => {
    if (!room || buttonConfig.disabled || !room.roomId || !currentPlayerId) return;
    void gameSocketHandlers.gameStart();
    setIsStarting(true);
  }, [room, buttonConfig.disabled, room?.roomId, currentPlayerId]);

  // 게임 초대 단축키 적용
  useShortcuts([
    {
      key: 'GAME_START',
      action: () => void handleStartGame(),
    },
  ]);

  return {
    isHost,
    buttonConfig,
    handleStartGame,
    isStarting,
  };
};
