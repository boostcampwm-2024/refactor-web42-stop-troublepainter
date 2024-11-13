import { useState } from 'react';
import { GameCanvas } from '@/components/canvas/GameCanvasExample';
import Chatting from '@/components/chat/Chatting';
import { Input } from '@/components/ui/Input';
import { QuizTitle } from '@/components/ui/QuizTitle';
import { UserInfoCard } from '@/components/ui/UserInfoCard';
import { Message } from '@/types/chat.types';
import { cn } from '@/utils/cn';

const MOCK_MESSAGES: Message[] = [
  { id: 1, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 2, nickname: '참가자2', content: '반가워요~', isOthers: true },
  { id: 3, nickname: '', content: '안녕하세요 :)', isOthers: false },
  { id: 12, nickname: '참가자1', content: '안녕하세요!', isOthers: true },
  { id: 22, nickname: '참가자2', content: '반가워요~', isOthers: true },
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

const GameRoomPage = () => {
  const [remainingTime] = useState(30);

  return (
    <div
      className={cn(
        // 기본 스타일 (모바일, < 640px)
        'relative flex h-[calc(100vh-5rem)] w-screen flex-col items-start justify-start overflow-scroll bg-eastbay-600 xs:h-[calc(100vh-6rem)]',
        // sm
        'sm:h-[calc(100vh-10rem)] sm:max-w-screen-sm sm:flex-row sm:rounded-sm sm:px-2',
        // md
        'md:max-w-screen-md md:rounded-md md:px-3',
        // lg
        'lg:max-w-screen-lg lg:rounded-lg',
        // xl
        'xl:max-w-screen-xl xl:rounded-xl',
      )}
    >
      {/* 유저 정보 영역 */}
      <aside
        className={cn(
          'flex h-24 w-full gap-2 overflow-x-scroll',
          // 데스크탑
          'sm:m-0 sm:mr-4 sm:h-full sm:w-3/12 sm:flex-col sm:overflow-y-scroll sm:border-r-2 sm:border-dashed sm:border-violet-50 sm:py-3 sm:pr-4',
        )}
      >
        <UserInfoCard username="그림러1" status="gaming" role="그림꾼" rank={1} score={50} />
        <UserInfoCard username="방해러1" status="gaming" role="방해꾼" rank={2} score={40} />
        <UserInfoCard username="구경러1" status="gaming" role="구경꾼" score={3} />
        <UserInfoCard username="구경러2" status="gaming" role="구경꾼" score={2} />
        <UserInfoCard username="그림러1" status="gaming" role="그림꾼" rank={1} score={50} />
        <UserInfoCard username="방해러1" status="gaming" role="방해꾼" rank={2} score={40} />
        <UserInfoCard username="구경러1" status="gaming" role="구경꾼" score={3} />
        <UserInfoCard username="구경러2" status="gaming" role="구경꾼" score={2} />
        <UserInfoCard username="그림러1" status="gaming" role="그림꾼" rank={1} score={50} />
        <UserInfoCard username="방해러1" status="gaming" role="방해꾼" rank={2} score={40} />
        <UserInfoCard username="구경러1" status="gaming" role="구경꾼" score={3} />
        <UserInfoCard username="구경러2" status="gaming" role="구경꾼" score={2} />
        <UserInfoCard username="그림러1" status="gaming" role="그림꾼" rank={1} score={50} />
        <UserInfoCard username="방해러1" status="gaming" role="방해꾼" rank={2} score={40} />
        <UserInfoCard username="구경러1" status="gaming" role="구경꾼" score={3} />
        <UserInfoCard username="구경러2" status="gaming" role="구경꾼" score={2} />
        <UserInfoCard username="그림러1" status="gaming" role="그림꾼" rank={1} score={50} />
        <UserInfoCard username="방해러1" status="gaming" role="방해꾼" rank={2} score={40} />
        <UserInfoCard username="구경러1" status="gaming" role="구경꾼" score={3} />
        <UserInfoCard username="구경러2" status="gaming" role="구경꾼" score={2} />
        <UserInfoCard username="그림러1" status="gaming" role="그림꾼" rank={1} score={50} />
        <UserInfoCard username="방해러1" status="gaming" role="방해꾼" rank={2} score={40} />
        <UserInfoCard username="구경러1" status="gaming" role="구경꾼" score={3} />
        <UserInfoCard username="구경러2" status="gaming" role="구경꾼" score={2} />
      </aside>

      {/* 중앙 영역 - 게임 화면 */}
      <main
        className={cn(
          'flex w-full flex-col',
          // 데스크톱
          'sm:w-6/12 sm:gap-4 sm:py-3',
        )}
      >
        <QuizTitle currentRound="1" totalRound="4" title="뭘까요?" remainingTime={remainingTime} />

        <GameCanvas role="그림꾼" maxPixels={100000} />
      </main>

      {/* 채팅 영역 */}
      <aside
        className={cn(
          'relative flex min-h-0 w-full flex-1 flex-col items-end',
          // 데스크탑
          'sm:ml-4 sm:h-full sm:w-3/12 sm:border-l-2 sm:border-dashed sm:border-violet-50 sm:py-3 sm:pl-2',
        )}
      >
        <Chatting messages={MOCK_MESSAGES} />
        <Input placeholder="답을 입력해주세요." className="mt-1 w-full" />
      </aside>
    </div>
  );
};

export default GameRoomPage;
