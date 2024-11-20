import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Setting } from '@/components/setting/Setting';
import { Button } from '@/components/ui/Button';
import { useGameSocketStore } from '@/core/socket/gameSocket.store';
import { cn } from '@/utils/cn';

const LobbyPage = () => {
  const [myId, setMyId] = useState('');
  const [hostId, setHostId] = useState('');
  const [isReady] = useState(false);

  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { room, players, roomSettings } = useGameSocketStore();

  useEffect(() => {
    setMyId('my-id');
    setHostId('host-id');
  }, []);

  const handleNavigateToGame = () => {
    if (roomId) {
      navigate(`/game/${roomId}`);
    } else {
      console.error('Room ID is not available');
    }
  };

  return (
    <>
      {/* 중앙 영역 - 대기 화면 */}
      <div className="flex w-full flex-col gap-0 sm:max-w-[39.5rem] sm:gap-4">
        <p className="mb-3 text-center text-xl text-eastbay-50 sm:mb-0 sm:text-2xl lg:text-3xl">
          Get Ready for the next battle
        </p>

        <div className="text-xl text-stroke-sm">
          <h1>Game Room: {roomId}</h1>
          <div>Room Status: {room?.status}</div>
          <div>Host: {room?.hostId}</div>
          <div>Settings: {JSON.stringify(roomSettings)}</div>
          <div>Players: {players?.map((p) => `${p.nickname}: ${p.playerId}`).join(', ')}</div>
          <Button onClick={handleNavigateToGame}>게임 시작</Button>
        </div>

        <Setting type={myId === hostId ? 'host' : 'participant'} />
        <div className="flex h-11 w-full gap-0 sm:h-14 sm:gap-8">
          <Button
            variant={isReady ? 'secondary' : 'primary'}
            className={cn(
              'h-full rounded-none border-0 text-xl',
              // 데스크톱 ,
              'sm:rounded-2xl sm:border-2 lg:text-2xl',
            )}
          >
            {isReady ? '해제' : '준비'}
          </Button>
          <Button
            className={cn(
              'h-full rounded-none border-0 bg-halfbaked-400 text-xl hover:bg-halfbaked-500',
              // 데스크톱
              'sm:rounded-2xl sm:border-2 lg:text-2xl',
            )}
          >
            초대
          </Button>
        </div>
      </div>
    </>
  );
};
export default LobbyPage;
