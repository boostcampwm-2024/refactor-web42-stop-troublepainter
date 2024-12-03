export const DRAWING_MODE = {
  PEN: 0,
  FILL: 1,
};

export const LINEWIDTH_VARIABLE = {
  MIN_WIDTH: 4,
  MAX_WIDTH: 20,
  STEP_WIDTH: 2,
};

export const MAINCANVAS_RESOLUTION_WIDTH = 1000;
export const MAINCANVAS_RESOLUTION_HEIGHT = 625;
//해상도 비율 변경 시 CanvasUI의 aspect-[16/10] 도 수정해야 정상적으로 렌더링됩니다.

export const COLORS_INFO = [
  { color: '검정', backgroundColor: '#000000' },
  { color: '분홍', backgroundColor: '#FF69B4' },
  { color: '노랑', backgroundColor: '#FFFF00' },
  { color: '하늘', backgroundColor: '#87CEEB' },
  { color: '회색', backgroundColor: '#808080' },
];

export const DEFAULT_MAX_PIXELS = 50000; // 기본값 설정
