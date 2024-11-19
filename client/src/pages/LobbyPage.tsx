import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useGameSocketStore } from '@/core/socket/gameSocket.store';

const LobbyPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { room, players, roomSettings } = useGameSocketStore();

  const handleNavigateToGame = () => {
    if (roomId) {
      navigate(`/game/${roomId}`);
    } else {
      console.error('Room ID is not available');
    }
  };

  return (
    <div className="text-xl text-stroke-sm">
      <h1>Game Room: {roomId}</h1>
      <div>Room Status: {room?.status}</div>
      <div>Host: {room?.hostId}</div>
      <div>Settings: {JSON.stringify(roomSettings)}</div>
      <div>Players: {players?.map((p) => `${p.nickname}: ${p.playerId}`).join(', ')}</div>
      <Button onClick={handleNavigateToGame}>게임 시작</Button>
    </div>
  );
};

export default LobbyPage;
