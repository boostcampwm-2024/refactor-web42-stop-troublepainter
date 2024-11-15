import { Button } from './Button';
import type { Meta, StoryObj } from '@storybook/react';
import helpIcon from '@/assets/help-icon.svg';

type Story = StoryObj<typeof Button>;

export default {
  component: Button,
  title: 'components/ui/Button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'transperent'],
      description: '버튼 스타일',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['text', 'icon'],
      description: '버튼 크기',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    children: {
      control: 'text',
      description: '버튼 내용',
    },
    className: {
      control: 'text',
      description: '추가 스타일링',
    },
  },
  parameters: {
    docs: {
      description: {
        component: '다양한 상황에서 사용할 수 있는 기본 버튼 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'text',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'text',
    children: 'Secondary Button',
  },
};

export const Transparent: Story = {
  args: {
    variant: 'transperent',
    size: 'icon',
    children: <img src={helpIcon} alt="Help Icon" />,
  },
};
