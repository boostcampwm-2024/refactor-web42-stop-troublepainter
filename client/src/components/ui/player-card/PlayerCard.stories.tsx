import { PlayerRole } from '@troublepainter/core';
import { PlayerCard } from './PlayerCard';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof PlayerCard>;

export default {
  title: 'components/game/PlayerCard',
  component: PlayerCard,
  argTypes: {
    status: {
      control: 'select',
      options: ['NOT_PLAYING', 'PLAYING'],
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
      options: [PlayerRole.PAINTER, PlayerRole.DEVIL, PlayerRole.GUESSER],
      description: '게임에서의 역할',
    },
    isHost: {
      control: 'boolean',
      description: '방장 여부',
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
    docs: {
      description: {
        component:
          '게임 참여자의 정보를 표시하는 카드 컴포넌트입니다. 상태에 따라 게임 진행 중/대기 중 모드로 표시되며, 방장일 경우 별도의 스타일이 적용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerCard>;

export const Default: Story = {
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 플레이어 카드 상태입니다.',
      },
    },
  },
};

export const Host: Story = {
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: true,
  },
  parameters: {
    docs: {
      description: {
        story: '방장인 플레이어의 카드 상태입니다. 보라색 배경과 "방장" 태그가 표시됩니다.',
      },
    },
  },
};

export const Gaming: Story = {
  args: {
    nickname: 'Player1',
    status: 'PLAYING',
    role: PlayerRole.PAINTER,
    score: 100,
    rank: 1,
  },
  parameters: {
    docs: {
      description: {
        story: '게임 진행 중인 플레이어의 카드입니다. 역할과 점수가 표시되며, 상위 랭크의 경우 왕관이 표시됩니다.',
      },
    },
  },
};

export const LongNickname: Story = {
  args: {
    nickname: 'VeryLongPlayerNameThatShouldBeTruncated',
    status: 'PLAYING',
    role: PlayerRole.DEVIL,
    score: 75,
  },
  parameters: {
    docs: {
      description: {
        story: '긴 닉네임이 주어졌을 때의 처리를 보여줍니다. 닉네임이 길 경우 말줄임표로 표시됩니다.',
      },
    },
  },
};
