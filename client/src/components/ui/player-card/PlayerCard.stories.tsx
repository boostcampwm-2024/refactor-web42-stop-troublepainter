import { PlayerRole } from '@troublepainter/core';
import { PlayerCard } from './PlayerCard';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof PlayerCard>;

export default {
  title: 'components/ui/player-card/PlayerCard',
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
    isWinner: {
      control: 'boolean',
      description: '1등 여부 (왕관 표시)',
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
    isMe: {
      control: 'boolean',
      description: '현재 사용자 여부',
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
          '게임 참여자의 정보를 표시하는 카드 컴포넌트입니다. 상태(게임 진행/대기)와 역할(본인/방장)에 따라 다른 스타일이 적용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerCard>;

export const Default: Story = {
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: null,
    isMe: false,
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 플레이어 카드 상태입니다.',
      },
    },
  },
};

export const CurrentUser: Story = {
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: null,
    isMe: true,
  },
  parameters: {
    docs: {
      description: {
        story: '현재 사용자의 카드 상태입니다. 보라색 테두리와 배경으로 구분됩니다.',
      },
    },
  },
};

export const Host: Story = {
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: true,
    isMe: false,
  },
  parameters: {
    docs: {
      description: {
        story: '방장인 플레이어의 카드 상태입니다. "방장" 태그가 표시됩니다.',
      },
    },
  },
};

export const HostAndCurrentUser: Story = {
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: true,
    isMe: true,
  },
  parameters: {
    docs: {
      description: {
        story: '방장이면서 현재 사용자인 카드 상태입니다. 보라색 테마와 방장 태그가 모두 적용됩니다.',
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
    isWinner: true,
    isHost: null,
    isMe: false,
  },
  parameters: {
    docs: {
      description: {
        story: '게임 진행 중인 플레이어의 카드입니다. 역할과 점수가 표시되며, 1등인 경우 왕관이 표시됩니다.',
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
    isHost: null,
    isMe: false,
  },
  parameters: {
    docs: {
      description: {
        story: '긴 닉네임이 주어졌을 때의 처리를 보여줍니다. 닉네임이 길 경우 말줄임표로 표시됩니다.',
      },
    },
  },
};
