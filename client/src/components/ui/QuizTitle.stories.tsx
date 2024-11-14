import { QuizTitle } from './QuizTitle';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof QuizTitle>;

export default {
  component: QuizTitle,
  title: 'components/game/QuizTitle',
  argTypes: {
    currentRound: {
      control: 'number',
      description: '현재 라운드',
      table: {
        type: { summary: 'number' },
      },
    },
    totalRound: {
      control: 'number',
      description: '전체 라운드',
      table: {
        type: { summary: 'number' },
      },
    },
    title: {
      control: 'text',
      description: '제시어',
      table: {
        type: { summary: 'string' },
      },
    },
    remainingTime: {
      control: 'number',
      description: '남은 시간 (초)',
      table: {
        type: { summary: 'number' },
      },
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
게임의 현재 상태를 보여주는 컴포넌트입니다.

### 기능
- 현재 라운드 / 전체 라운드 표시
- 퀴즈 제시어 표시
- 남은 드로잉 시간 표시 (10초 이하일 때 깜빡이는 효과)
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-eastbay-50 p-5">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof QuizTitle>;

export const Default: Story = {
  args: {
    currentRound: 1,
    totalRound: 10,
    title: '사과',
    remainingTime: 30,
  },
};

export const UrgentTimer: Story = {
  args: {
    currentRound: 5,
    totalRound: 10,
    title: '바나나',
    remainingTime: 8,
  },
  parameters: {
    docs: {
      description: {
        story: '남은 시간이 10초 이하일 때는 타이머가 깜빡이는 효과가 적용됩니다.',
      },
    },
  },
};
