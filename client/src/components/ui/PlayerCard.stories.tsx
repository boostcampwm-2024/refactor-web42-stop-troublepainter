import { PlayerRole, PlayerStatus } from '@troublepainter/core';
import { PlayerCard } from './PlayerCard';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof PlayerCard>;

export default {
  title: 'components/game/PlayerCard',
  component: PlayerCard,
  argTypes: {
    status: {
      control: 'select',
      options: ['notReady', 'ready', 'gaming'],
      description: '사용자의 현재 상태',
    },
    nickname: {
      control: 'text',
      description: '사용자 이름',
    },
    rank: {
      control: 'number',
      description: '사용자의 순위 (1-3등일 경우 왕관 표시)',
    },
    score: {
      control: 'number',
      description: '게임 중 획득한 점수',
    },
    role: {
      control: 'select',
      options: ['그림꾼', '방해꾼', '구경꾼'],
      description: '게임에서의 역할',
    },
    className: {
      control: 'text',
      description: '추가 스타일링',
    },
    profileImage: {
      control: 'text',
      description: '사용자의 프로필 이미지',
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerCard>;

export const Default: Story = {
  args: {
    nickname: 'Player1',
    status: PlayerStatus.NOT_READY,
  },
};

export const Ready: Story = {
  args: {
    nickname: 'Player1',
    status: PlayerStatus.READY,
  },
};

export const Gaming: Story = {
  args: {
    nickname: 'Player1',
    status: PlayerStatus.PLAYING,
    role: PlayerRole.PAINTER,
    score: 100,
    rank: 1,
  },
};
