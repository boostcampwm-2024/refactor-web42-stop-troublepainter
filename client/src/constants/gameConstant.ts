import { PlayerRole } from '@troublepainter/core';
import { PlayingRoleText } from '@/types/game.types';

export const PLAYING_ROLE_TEXT: Record<PlayerRole, PlayingRoleText> = {
  [PlayerRole.DEVIL]: '방해꾼',
  [PlayerRole.GUESSER]: '구경꾼',
  [PlayerRole.PAINTER]: '그림꾼',
};
