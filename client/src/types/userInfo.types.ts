// 유저 정보 카드의 상태를 정의하는 타입
// {'notReady' | 'ready' | 'gaming'} UserStatus
export type ReadyStatus = 'notReady' | 'ready';
export type UserStatus = ReadyStatus | 'gaming';

export type UserRank = 1 | 2 | 3;

// 게임에서 유저의 역할을 정의하는 타입
export type UserRole = '그림꾼' | '방해꾼' | '구경꾼';
// 그림을 그릴 수 있는 역할을 정의
export type DrawableRole = Exclude<UserRole, '구경꾼'>;
// 화가(그림 그리는 사람들)의 역할을 정의하는 타입
export type PainterRole = DrawableRole;
