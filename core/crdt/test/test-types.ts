import { BrowserContext, Page } from '@playwright/test';

export interface DrawingClient {
  context: BrowserContext;
  page: Page;
}

export interface TestResult {
  clientCount: number;
  testType: TestType;
  diffRatio: number;
  success: boolean;
  diffImagePath?: string;
}

export type TestType =
  | 'static-identical' // 이미 그려진 동일 이미지 비교
  | 'static-different' // 이미 그려진 다른 이미지 비교
  | 'concurrent-identical' // 동시에 같은 그림 그리기
  | 'concurrent-different' // 동시에 다른 그림 그리기
  | 'random-drawing'; // 랜덤 그리기

// 테스트 설정
export const TEST_CONFIG = {
  url: 'http://localhost:5173/',
  syncWaitTime: 1000,
  clientCounts: [2, 3, 5],
  viewport: { width: 1280, height: 720 },
  timeouts: {
    test: 300000,
    page: 30000,
    domReady: 10000,
    canvas: 10000,
  },
} as const;

export type DrawingFunction = (page: Page, clientIndex?: number) => Promise<void>;

export const ACCEPTANCE_CRITERIA = {
  'static-identical': { maxDiff: 0.01 }, // 동일 이미지는 차이가 매우 적어야 함
  'static-different': { minDiff: 0.1, expectedDiff: 0.2 }, // 다른 이미지는 충분한 차이가 있어야 함
  'concurrent-identical': { maxDiff: 0.01 }, // 동시 동일 그리기도 차이가 매우 적어야 함
  'concurrent-different': { minDiff: 0.45 }, // 공유 캔버스라 최종 상태는 동기화되어야 함
  'random-drawing': { maxDiff: 0.05 }, // 공유 캔버스라 최종 상태는 동기화되어야 함
} as const;
