import { Outlet } from 'react-router-dom';
import ChatList from '@/components/chat/ChatList';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { UserInfoCard } from '@/components/ui/UserInfoCard';
import { useGameSocket } from '@/hooks/socket/useGameSocket';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { Message } from '@/types/chat.types';
import { cn } from '@/utils/cn';

// 임시 데이터
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

const GameLayout = () => {
  const { players } = useGameSocketStore();
  const { isConnected } = useGameSocket();
  // console.log(players, room, roomSettings);

  // 연결 상태에 따른 로딩 표시
  if (!isConnected) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex h-96 w-96 animate-spin items-center justify-center text-5xl text-stroke-md">
          연결 중...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-start bg-gradient-to-b from-violet-950 via-violet-800 to-fuchsia-800 lg:py-5">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-center">
        <Logo variant="side" />
      </header>

      <main className="mx-auto">
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
            {/* 임시 데이터 */}
            {players?.map((player) => (
              <UserInfoCard
                key={player.playerId}
                username={player.nickname}
                status={player.status}
                score={player.score}
              />
            ))}

            {/* <UserInfoCard
          username="그림러그림러그그림러그림러그"
          status={PlayerStatus.PLAYING}
          role={PlayerRole.PAINTER}
          rank={1}
          score={50}
        />
        <UserInfoCard
          username="TroublepainterTroublepainter"
          status={PlayerStatus.PLAYING}
          role={PlayerRole.DEVIL}
          rank={2}
          score={40}
        />
        <UserInfoCard username="구경러1" status={PlayerStatus.PLAYING} role={PlayerRole.GUESSER} score={3} />
        <UserInfoCard username="구경러2" status={PlayerStatus.PLAYING} role={PlayerRole.GUESSER} score={2} />
        <UserInfoCard username="그림러1" status={PlayerStatus.PLAYING} role={PlayerRole.PAINTER} rank={0} score={50} />
        <UserInfoCard username="방해러1" status={PlayerStatus.PLAYING} role={PlayerRole.DEVIL} rank={1} score={40} /> */}
          </aside>

          {/* 중앙 영역 */}
          <section
            className={cn(
              'flex w-full flex-col items-center justify-center sm:gap-2',
              // 데스크톱
              'lg:w-6/12 lg:gap-4 lg:py-3 2xl:py-5',
            )}
          >
            <Outlet />
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
            <ChatList messages={MOCK_MESSAGES} />
            <Input placeholder="답을 입력해주세요." className="mt-1 w-full" />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default GameLayout;
