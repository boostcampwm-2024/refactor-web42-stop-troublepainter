import { Browser, expect, Page } from '@playwright/test';
import { DrawingClient, TEST_CONFIG } from './test-types';
import { PNG } from 'pngjs';
import { clearCanvas } from './drawing-utils';

export const compareCanvasPixels = async (basePage: Page, targetPage: Page): Promise<number> => {
  const getCanvasData = async (page: Page) => {
    return await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2d context');

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return {
        data: Array.from(imageData.data),
        width: canvas.width,
        height: canvas.height,
      };
    });
  };

  // Promise.all을 사용하여 두 페이지의 데이터를 병렬로 가져오기
  const [pixels1, pixels2] = await Promise.all([getCanvasData(basePage), getCanvasData(targetPage)]);

  // 다른 픽셀 수 계산
  const differentPixels = pixels1.data.reduce((count, pixel, index) => {
    if (pixel !== pixels2.data[index]) {
      return count + 1;
    }
    return count;
  }, 0);

  const totalPixels = pixels1.data.length;
  const diffRatio = differentPixels / totalPixels;

  return diffRatio;
};

// 1. 픽셀 데이터 직접 비교
export const compareByPixelData = async (basePage: Page, targetPage: Page): Promise<number> => {
  const getPixelData = async (page: Page) => {
    return page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get 2d context');

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return Array.from(imageData.data);
    });
  };

  const [basePixels, targetPixels] = await Promise.all([getPixelData(basePage), getPixelData(targetPage)]);

  let differentPixels = 0;
  for (let i = 0; i < basePixels.length; i += 4) {
    if (
      basePixels[i] !== targetPixels[i] ||
      basePixels[i + 1] !== targetPixels[i + 1] ||
      basePixels[i + 2] !== targetPixels[i + 2] ||
      basePixels[i + 3] !== targetPixels[i + 3]
    ) {
      differentPixels++;
    }
  }

  return differentPixels / (basePixels.length / 4);
};

// 2. PNG 해시값 비교
export const compareByPng = async (basePage: Page, targetPage: Page): Promise<number> => {
  // 임시 대기 시간 추가
  await Promise.all([basePage.waitForTimeout(100), targetPage.waitForTimeout(100)]);

  const screenshot1 = await basePage.locator('canvas').screenshot();
  const screenshot2 = await targetPage.locator('canvas').screenshot();

  const img1 = PNG.sync.read(screenshot1);
  const img2 = PNG.sync.read(screenshot2);

  if (img1.width !== img2.width || img1.height !== img2.height) {
    return 1;
  }

  let differentPixels = 0;
  const totalPixels = img1.width * img1.height;

  for (let y = 0; y < img1.height; y++) {
    for (let x = 0; x < img1.width; x++) {
      const idx = (img1.width * y + x) << 2;
      if (
        img1.data[idx] !== img2.data[idx] ||
        img1.data[idx + 1] !== img2.data[idx + 1] ||
        img1.data[idx + 2] !== img2.data[idx + 2] ||
        img1.data[idx + 3] !== img2.data[idx + 3]
      ) {
        differentPixels++;
      }
    }
  }

  return differentPixels / totalPixels;
};

// 3. Playwright 내장 스크린샷 비교
export const compareByPlaywright = async (basePage: Page, targetPage: Page): Promise<number> => {
  try {
    // 기준 스냅샷 생성 및 저장
    await expect(basePage.locator('canvas')).toHaveScreenshot('base-canvas.png');
    // 비교 스냅샷 생성 및 저장
    await expect(targetPage.locator('canvas')).toHaveScreenshot('target-canvas.png');

    // Playwright의 스냅샷 비교는 자동으로 처리되므로, catch로 결과 분석
    return 0; // 두 스크린샷이 일치
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // 에러 메시지에서 차이점 퍼센트 추출
    const match = error.message.match(/(\d+\.\d+)% of all pixels/);
    return match ? parseFloat(match[1]) : 100; // 차이점 반환
  }
};

// 공통 비교 함수 타입 정의
export type CompareFunction = (basePage: Page, targetPage: Page) => Promise<number>;

// 공통 테스트 실행 함수
export const runCanvasComparisonTest = async (
  clients: DrawingClient[],
  drawingFunction: (page: Page, clientIndex?: number) => Promise<void>,
  compareFunction: CompareFunction,
  acceptanceCriteria: number,
  testMode: 'identical' | 'different',
): Promise<void> => {
  console.log(`Starting sequential test with ${clients.length} clients`);

  const diffResults = [];
  for (let i = 1; i < clients.length; i++) {
    // 1. 첫 번째 클라이언트 그리기 및 결과 저장
    await clearCanvas(clients[0].page);
    await drawingFunction(clients[0].page, 0);
    const baseCanvas = await clients[0].page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      // 현재 캔버스 상태를 새로운 캔버스에 복사
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not found');
      ctx.drawImage(canvas, 0, 0);
      return tempCanvas.toDataURL(); // base64로 변환
    });

    // 2. 두 번째 클라이언트 그리기 및 결과 저장
    await clearCanvas(clients[i].page);
    await drawingFunction(clients[i].page, i);
    const compareCanvas = await clients[i].page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not found');
      ctx.drawImage(canvas, 0, 0);
      return tempCanvas.toDataURL();
    });

    // 3. 저장된 결과를 임시 캔버스에 그리고 비교
    await clients[0].page.evaluate((base64Image: string) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not found');
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(Promise);
        };
        img.src = base64Image;
      });
    }, baseCanvas);

    await clients[i].page.evaluate((base64Image: string) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not found');
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(Promise);
        };
        img.src = base64Image;
      });
    }, compareCanvas);

    const diffRatio = await compareFunction(clients[0].page, clients[i].page);
    diffResults.push({
      clientIndex: i,
      diffRatio,
    });
  }

  // 결과 검증
  diffResults.forEach(({ clientIndex, diffRatio }) => {
    console.log(`Client ${clientIndex} comparison:`, {
      diffRatio,
      acceptanceCriteria,
      passes: testMode === 'identical' ? diffRatio <= acceptanceCriteria : diffRatio >= acceptanceCriteria,
    });

    if (testMode === 'identical') {
      expect(diffRatio).toBeLessThanOrEqual(acceptanceCriteria);
    } else {
      expect(diffRatio).toBeGreaterThanOrEqual(acceptanceCriteria);
    }
  });
};

// 테스트 설정 초기화 함수
export async function setupSameURL(clientCount: number, browser: Browser): Promise<DrawingClient[]> {
  const clients: DrawingClient[] = [];

  for (let i = 0; i < clientCount; i++) {
    const context = await browser.newContext({
      viewport: TEST_CONFIG.viewport,
    });
    const page = await context.newPage();

    // 테스트 페이지로 접속
    await page.goto(TEST_CONFIG.url);

    // 캔버스 요소가 로드될 때까지 대기
    await page.waitForSelector('canvas');

    clients.push({ context, page });
    console.log(`Client ${i} connected to test page`);
  }

  return clients;
}

export async function setupDifferentURL(clientCount: number, browser: Browser): Promise<DrawingClient[]> {
  const clients: DrawingClient[] = [];

  for (let i = 0; i < clientCount; i++) {
    const context = await browser.newContext({
      viewport: TEST_CONFIG.viewport,
    });
    const page = await context.newPage();

    // 각 클라이언트마다 다른 URL로 접속
    const uniqueUrl = `${TEST_CONFIG.url}/canvas?id=test-${i}`;
    // 또는 완전히 다른 경로도 가능
    // const uniqueUrl = `${TEST_CONFIG.baseUrl}/canvas-${i}`;

    await page.goto(uniqueUrl);
    await page.waitForSelector('canvas');

    clients.push({ context, page });
    console.log(`Client ${i} connected to independent canvas at ${uniqueUrl}`);
  }

  return clients;
}

// 리소스 정리 함수
export async function cleanupClients(clients: DrawingClient[]) {
  for (const client of clients) {
    try {
      if (client.page && !client.page.isClosed()) {
        await client.page.close().catch(() => {});
      }
      if (client.context) {
        await client.context.close().catch(() => {});
      }
    } catch (error) {
      console.error('Error closing client:', error);
    }
  }
}
