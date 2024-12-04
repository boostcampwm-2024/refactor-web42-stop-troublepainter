export const SHORTCUT_KEYS = {
  // 설정 관련
  DROPDOWN_TOTAL_ROUNDS: {
    key: '1',
    alternativeKeys: ['1', '!'],
    description: '라운드 수 설정',
  },
  DROPDOWN_MAX_PLAYERS: {
    key: '2',
    alternativeKeys: ['2', '@'],
    description: '플레이어 수 설정',
  },
  DROPDOWN_DRAW_TIME: {
    key: '3',
    alternativeKeys: ['3', '#'],
    description: '제한시간 설정',
  },
  // 게임 관련
  CHAT: {
    key: 'Enter',
    alternativeKeys: null,
    description: '채팅',
  },
  GAME_START: {
    key: 's',
    alternativeKeys: ['s', 'S', 'ㄴ'],
    description: '게임 시작',
  },
  GAME_INVITE: {
    key: 'i',
    alternativeKeys: ['i', 'I', 'ㅑ'],
    description: '초대하기',
  },
} as const;
