import { Input } from './Input';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Input>;

export default {
  title: 'components/ui/Input',
  component: Input,
  argTypes: {
    label: {
      control: 'text',
      description: '입력 필드의 레이블',
    },
    placeholder: {
      control: 'text',
      description: '입력 필드의 플레이스홀더',
    },
  },
  parameters: {
    docs: {
      description: {
        component: '사용자 입력을 받을 수 있는 기본 입력 필드 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Default Label',
    placeholder: 'Default placeholder',
  },
};
