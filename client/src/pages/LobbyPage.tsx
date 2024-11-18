import { useEffect, useState } from 'react';
import Chatting from '@/components/chat/Chatting';
import { Setting } from '@/components/setting/Setting';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserInfoCard } from '@/components/ui/UserInfoCard';
import { Message } from '@/types/chat.types';
import { Player, PlayerStatus } from '@/types/game.types';
import { cn } from '@/utils/cn';

const MOCK_MESSAGES: Message[] = [
  { id: 1, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 2, nickname: '참가자2', content: '반가워요~', isOthers: true },
  { id: 3, nickname: '', content: '안녕하세요 :)', isOthers: false },
  { id: 12, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  {
    id: 22,
    nickname: '참가자2',
    content: '반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~반가워요~',
    isOthers: true,
  },
  { id: 32, nickname: '', content: '안녕하세요 :)', isOthers: false },
  { id: 123, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 223, nickname: '참가자2', content: '반가워요~', isOthers: true },
  { id: 323, nickname: '', content: '안녕하세요 :)', isOthers: false },
  { id: 1234, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 2234, nickname: '참가자2', content: '반가워요~', isOthers: true },
  { id: 3234, nickname: '', content: '안녕하세요 :)', isOthers: false },
  { id: 12345, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 22345, nickname: '참가자2', content: '반가워요~', isOthers: true },
  { id: 32345, nickname: '', content: '안녕하세요 :)', isOthers: false },
];

const MOCK_PARTICIPANTS: Player[] = [
  { playerId: 'my-id', nickname: '그림러그림러그그림러그림러그', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'd4e5f6', nickname: 'TroublepainterTroublepainter', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'g7h8i9', nickname: 'my-id', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'j1k2l3', nickname: '구경러2', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'm4n5o6', nickname: '그림러1', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'p7q8r9', nickname: '방해러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 's1t2u3', nickname: '구경러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'v4w5x6', nickname: '구경러2', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'y7z8a1', nickname: '그림러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'b2c3d4', nickname: '방해러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'e5f6g7', nickname: '구경러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'h8i9j1', nickname: '구경러2', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'k2l3m4', nickname: '그림러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'n5o6p7', nickname: '방해러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'q8r9s1', nickname: '구경러1', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 't2u3v4', nickname: '구경러2', status: PlayerStatus.READY, score: 0 },
  { playerId: 'w5x6y7', nickname: '그림러1', status: PlayerStatus.NOT_READY, score: 0 },
  { playerId: 'z8a1b2', nickname: '방해러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'c3d4e5', nickname: '구경러1', status: PlayerStatus.READY, score: 0 },
  { playerId: 'f6g7h8', nickname: '구경러2', status: PlayerStatus.NOT_READY, score: 0 },
];

const LobbyPage = () => {
  const [myId, setMyId] = useState('');
  const [hostId, setHostId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    setMyId('my-id');
    setHostId('host-id');
    setMessages(MOCK_MESSAGES);
    setPlayers(MOCK_PARTICIPANTS);
  }, []);

  const handleClickReadyButton = () => {
    setIsReady((prev) => !prev);
  };

  return (
    <div
      className={cn(
        // 기본 스타일 (모바일, < 1024px)
        'relative flex h-[calc(100vh-5rem)] min-h-[50rem] w-screen flex-col items-start justify-start bg-eastbay-600 xs:h-[calc(100vh-6rem)]',
        // lg
        'lg:h-[calc(100vh-10rem)] lg:min-h-[29rem] lg:max-w-screen-lg lg:flex-row lg:rounded-lg lg:px-3',
        // xl
        'xl:min-h-[34rem] xl:max-w-screen-xl xl:rounded-xl',
        // 2xl
        '2xl:min-h-[35.5rem] 2xl:max-w-screen-2xl 2xl:rounded-2xl 2xl:px-5',
      )}
    >
      {/* 유저 정보 영역 */}
      <aside
        className={cn(
          'flex h-24 w-full gap-0.5 overflow-x-scroll px-2 pt-2',
          // 데스크탑
          'lg:m-0 lg:mr-4 lg:h-full lg:w-3/12 lg:flex-col lg:gap-2 lg:overflow-y-scroll lg:border-r-2 lg:border-dashed lg:border-violet-50 lg:p-0 lg:py-3 lg:pr-4 2xl:-mr-5 2xl:py-5 2xl:pr-5',
        )}
      >
        {players.map((participant) => {
          const { nickname, status, role, score, playerId } = participant;
          return <UserInfoCard key={playerId} username={nickname} status={status} role={role} score={score} />;
        })}
      </aside>

      {/* 중앙 영역 - 설정 화면 */}
      <section
        className={cn(
          'flex w-full flex-col items-center justify-center sm:gap-2',
          // 데스크톱
          'lg:w-6/12 lg:gap-4 lg:py-3 2xl:py-5',
        )}
      >
        <div className="flex w-full flex-col gap-0 sm:max-w-[39.5rem] sm:gap-4">
          <p className="mb-3 text-center text-xl text-eastbay-50 sm:mb-0 sm:text-2xl lg:text-3xl">
            Get Ready for the next battle
          </p>

          {<Setting type={myId === hostId ? 'host' : 'participant'} />}
          <div className="flex h-11 w-full gap-0 sm:h-14 sm:gap-8">
            <Button
              variant={isReady ? 'secondary' : 'primary'}
              onClick={handleClickReadyButton}
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
      </section>

      {/* 채팅 영역 */}
      <aside
        className={cn(
          'relative flex min-h-0 w-full flex-1 flex-col items-end px-2 pb-2 sm:h-full',
          // 데스크탑
          'lg:ml-4 lg:h-full lg:w-3/12 lg:border-l-2 lg:border-dashed lg:border-violet-50 lg:py-3 lg:pl-2',
          '2xl:-ml-5 2xl:py-5 2xl:pl-5',
        )}
      >
        <Chatting messages={messages} />
        <Input placeholder="답을 입력해주세요." className="mt-1 w-full" />
      </aside>
    </div>
  );
};

export default LobbyPage;
