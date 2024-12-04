const CDN_BASE = 'https://kr.object.ncloudstorage.com/troublepainter-assets';

export const CDN = {
  BACKGROUND_MUSIC: `${CDN_BASE}/sounds/background-music.mp3`,
  MAIN_LOGO: `${CDN_BASE}/logo/main-logo.png`,
  SIDE_LOGO: `${CDN_BASE}/logo/side-logo.png`,
  // tailwind config 설정
  // BACKGROUND: `${CDN_BASE}/patterns/background.png`,
} as const;
