import { memo } from 'react';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatList } from '@/components/chat/ChatList';
import { useChatSocket } from '@/hooks/socket/useChatSocket';

export const ChatContatiner = memo(() => {
  // 채팅 소켓 연결 : 최상위 관리
  useChatSocket();

  return (
    <div className="relative flex h-full w-full flex-col">
      <ChatList />
      <ChatInput />
    </div>
  );
});
