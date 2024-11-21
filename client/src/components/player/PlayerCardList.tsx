import { PlayerCard } from '@/components/ui/PlayerCard';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

const PlayerCardList = () => {
  const { players, room } = useGameSocketStore();

  if (!players?.length) return null;

  return (
    <>
      {players.map((player) => (
        <PlayerCard
          key={player.playerId}
          nickname={player.nickname}
          status={player.status}
          role={player.role}
          score={player.score}
          isHost={player.playerId === room?.hostId}
        />
      ))}
    </>
  );
};

export { PlayerCardList };
