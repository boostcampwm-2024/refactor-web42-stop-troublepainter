import { HTMLAttributes } from 'react';
import { Input } from '../ui/Input';
import { ChatBubble } from './ChatBubbleUI';
import { cn } from '@/utils/cn';

interface Message {
  nickname: string;
  content: string;
  isOthers: boolean;
  id: number;
}

export interface ChattingProps extends HTMLAttributes<HTMLDivElement> {
  messages: Message[];
}

const Chatting = ({ messages, className, ...props }: ChattingProps) => {
  return (
    <section className={cn('flex w-full flex-col items-center justify-center', className)} {...props}>
      <p className="mb-7 text-xl text-eastbay-50">
        여기에다가 답하고
        <br /> 채팅할 수 있습니다.
      </p>
      <div className="flex w-full flex-col gap-2">
        {messages.map((message: Message) => {
          const { nickname, content, id } = message;
          if (message.isOthers) return <ChatBubble content={content} nickname={nickname} key={id} />;
          else return <ChatBubble content={content} variant="secondary" key={id} />;
        })}
      </div>
      <Input placeholder="답을 입력해주세요." className="mt-1" />
    </section>
  );
};

export default Chatting;
