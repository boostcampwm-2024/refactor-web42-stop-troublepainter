import { Logo } from './Logo';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Logo>;

export default {
  component: Logo,
  title: 'components/game/Logo',
  argTypes: {
    variant: {
      control: 'select',
      options: ['main', 'side'],
      description: '로고 배치',
      table: {
        defaultValue: { summary: 'main' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: '로고 이미지 설명',
    },
    className: {
      control: 'text',
      description: '추가 스타일링',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '프로젝트의 메인 로고와 보조 로고를 표시하는 컴포넌트입니다. 반응형 디자인을 지원하며 접근성을 고려한 설명을 포함합니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Logo>;

export const Main: Story = {
  args: {
    variant: 'main',
    ariaLabel: '로고 설명',
  },
};

export const Side: Story = {
  args: {
    variant: 'side',
    ariaLabel: '로고 설명',
  },
};
