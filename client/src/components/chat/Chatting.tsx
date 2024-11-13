import { HTMLAttributes } from 'react';
import { ChatBubble } from './ChatBubbleUI';
import { Message } from '@/types/chat.types';
import { cn } from '@/utils/cn';

export interface ChattingProps extends HTMLAttributes<HTMLDivElement> {
  messages: Message[];
}

const Chatting = ({ messages, className, ...props }: ChattingProps) => {
  return (
    <section className={cn('flex h-full w-full flex-col gap-2 overflow-y-scroll', className)} {...props}>
      <p className="mb-7 text-center text-xl text-eastbay-50">
        여기에다가 답하고
        <br /> 채팅할 수 있습니다.
      </p>
      {messages.map((message: Message) => {
        const { nickname, content, id } = message;
        if (message.isOthers) return <ChatBubble content={content} nickname={nickname} key={id} />;
        else return <ChatBubble content={content} variant="secondary" key={id} />;
      })}
    </section>
  );
};

export default Chatting;
