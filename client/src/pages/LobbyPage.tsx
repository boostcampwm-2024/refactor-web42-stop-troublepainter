import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Setting } from '@/components/setting/Setting';
import { Button } from '@/components/ui/Button';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { cn } from '@/utils/cn';

const LobbyPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { players, room, currentPlayerId } = useGameSocketStore();
  // 현재 사용자가 방장인지 확인
  const isHost = useMemo(() => room?.hostId === currentPlayerId, [room?.hostId, currentPlayerId]);

  const buttonConfig = useMemo(() => {
    if (!isHost) return START_BUTTON_STATUS.NOT_HOST;
    if (players.length < 4) return START_BUTTON_STATUS.NOT_ENOUGH_PLAYERS;
    return START_BUTTON_STATUS.CAN_START;
  }, [isHost, players.length]);

  const handleStartGame = () => {
    if (buttonConfig.disabled || !roomId) return;
    navigate(`/game/${roomId}`);
  };

  return (
    <>
      {/* 중앙 영역 - 대기 화면 */}
      <div className="flex w-full flex-col gap-0 sm:max-w-[39.5rem] sm:gap-4">
        <p className="mb-3 text-center text-xl text-eastbay-50 text-stroke-md sm:mb-0 sm:text-2xl lg:text-3xl">
          Get Ready for the next battle
        </p>

        <Button onClick={() => navigate(`/game/${roomId}`)} variant={'secondary'}>
          테스트 게임 시작
        </Button>

        <Setting type={isHost ? 'host' : 'participant'} />
        <div className="flex h-11 w-full gap-0 sm:h-14 sm:gap-8">
          <Button
            onClick={handleStartGame}
            disabled={buttonConfig.disabled}
            title={buttonConfig.title}
            className={cn(
              'h-full rounded-none border-0 text-xl',
              'sm:rounded-2xl sm:border-2 lg:text-2xl',
              !isHost && 'cursor-not-allowed opacity-50 hover:bg-violet-500',
            )}
          >
            {buttonConfig.content}
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

const START_BUTTON_STATUS = {
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
