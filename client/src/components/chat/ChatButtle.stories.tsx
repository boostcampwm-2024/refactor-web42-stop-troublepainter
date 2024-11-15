import { ChatBubble } from './ChatBubbleUI';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof ChatBubble>;

export default {
  component: ChatBubble,
  title: 'components/chat/ChatBubbleUI',
  argTypes: {
    content: {
      control: 'text',
      description: '채팅 메시지 내용',
      table: {
        type: { summary: 'string' },
      },
    },
    nickname: {
      control: 'text',
      description: '사용자 닉네임 (있으면 다른 사용자의 메시지)',
      table: {
        type: { summary: 'string' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary'],
      description: '채팅 버블 스타일',
    },
    className: {
      control: 'text',
      description: '추가 스타일링',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
채팅 메시지를 표시하는 버블 컴포넌트입니다.

### 특징
- 내 메시지와 다른 사용자의 메시지를 구분하여 표시
- 다른 사용자의 메시지일 경우 닉네임 표시
- 두 가지 스타일 variant 지원 (default: 하늘색, secondary: 노란색)
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] w-full bg-eastbay-950 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ChatBubble>;

export const MyMessage: Story = {
  args: {
    content: '안녕하세요!',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: '내가 보낸 메시지입니다. 오른쪽 정렬되며 닉네임이 표시되지 않습니다.',
      },
    },
  },
};

export const OtherUserMessage: Story = {
  args: {
    content: '반갑습니다!',
    nickname: '사용자1',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: '다른 사용자가 보낸 메시지입니다. 왼쪽 정렬되며 닉네임이 표시됩니다.',
      },
    },
  },
};

export const LongMessage: Story = {
  args: {
    content:
      '이것은 매우 긴 메시지입니다. 채팅 버블이 어떻게 긴 텍스트를 처리하는지 보여주기 위한 예시입니다. 최대 너비는 85%로 제한됩니다.',
    nickname: '사용자2',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: '긴 메시지가 주어졌을 때의 레이아웃을 보여줍니다.',
      },
    },
  },
};
