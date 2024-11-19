import { PropsWithChildren } from 'react';
import ChatList from '@/components/chat/ChatList';
import { Input } from '@/components/ui/Input';
import { UserInfoCard } from '@/components/ui/UserInfoCard';
import { Message } from '@/types/chat.types';
import { Player } from '@/types/game.types';
import { cn } from '@/utils/cn';

interface GamePlayLayoutProps extends PropsWithChildren {
  messages: Message[];
  players: Player[];
}

const GamePlayLayout = ({ messages, players, children }: GamePlayLayoutProps) => {
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

      {/* 중앙 영역 */}
      <section
        className={cn(
          'flex w-full flex-col items-center justify-center sm:gap-2',
          // 데스크톱
          'lg:w-6/12 lg:gap-4 lg:py-3 2xl:py-5',
        )}
      >
        {children}
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
        <ChatList messages={messages} />
        <Input placeholder="답을 입력해주세요." className="mt-1 w-full" />
      </aside>
    </div>
  );
};

export default GamePlayLayout;
