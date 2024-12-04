import { memo } from 'react';
import { PlayerRole, PlayerStatus } from '@troublepainter/core';
import { PlayerCard } from '@/components/ui/player-card/PlayerCard';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const PlayerCardList = memo(() => {
  // 개별 selector 사용으로 변경
  const players = useGameSocketStore((state) => state.players);
  const hostId = useGameSocketStore((state) => state.room?.hostId);
  const roundAssignedRole = useGameSocketStore((state) => state.roundAssignedRole);
  const currentPlayerId = useGameSocketStore((state) => state.currentPlayerId);

  if (!players?.length) return null;

  const getPlayerRole = (playerRole: PlayerRole | undefined, myRole: PlayerRole | null) => {
    if (myRole === PlayerRole.GUESSER) return playerRole === PlayerRole.GUESSER ? playerRole : null;
    return playerRole;
  };

  return (
    <>
      {players.map((player) => {
        const playerRole = getPlayerRole(player.role, roundAssignedRole) || null;

        return (
          <PlayerCard
            profileImage={player.profileImage}
            key={player.playerId}
            nickname={player.nickname}
            status={player.status}
            role={playerRole}
            score={player.score}
            isHost={player.status === PlayerStatus.NOT_PLAYING && player.playerId === hostId} // 이 플레이어가 방장인지
            isMe={player.playerId === currentPlayerId}
          />
        );
      })}
    </>
  );
});

export { PlayerCardList };
