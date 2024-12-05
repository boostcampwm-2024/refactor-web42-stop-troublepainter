import { Page } from '@playwright/test';
import { DrawingFunction } from './test-types';

export async function clearCanvas(page: Page): Promise<void> {
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
}

export const drawingPatterns: Record<string, DrawingFunction> = {
  // 동일한 사각형 그리기 (fillRect)
  identicalByRect: async (page: Page) => {
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get 2d context');

      ctx.beginPath();
      // 전체 영역을 한번에 채우기
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.stroke();
    });
  },

  // 전체 50% 채워지는 줄무늬 그리기 (fillRect)
  differentByRect: async (page: Page, clientIndex?: number) => {
    if (!clientIndex) return;

    await page.evaluate(
      ({ index }) => {
        const canvas = document.querySelector('canvas');
        if (!canvas) throw new Error('Canvas not found');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Cannot get 2d context');

        const isEvenClient = index % 2 === 0;
        ctx.beginPath();

        if (isEvenClient) {
          // 가로 줄무늬
          for (let y = 0; y < canvas.height; y += 20) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, y, canvas.width, 10);
          }
        } else {
          // 세로 줄무늬
          for (let x = 0; x < canvas.width; x += 20) {
            ctx.fillStyle = 'black';
            ctx.fillRect(x, 0, 10, canvas.height);
          }
        }

        ctx.stroke();
      },
      { index: clientIndex },
    );
  },

  // 동일한 사각형 그리기 (Mouse move)
  identicalByMouse: async (page: Page) => {
    // 먼저 캔버스 색상 설정
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get 2d context');

      // 색상과 선 스타일 고정
      ctx.strokeStyle = '#000000'; // 검정색
      ctx.lineWidth = 2;
    });

    const box = await page.locator('canvas').boundingBox();
    if (!box) throw new Error('Canvas not found');

    await page.mouse.move(box.x, box.y);
    await page.mouse.down();

    for (let x = 0; x < box.width; x += 10) {
      for (let y = 0; y < box.height; y += 10) {
        await page.mouse.move(box.x + x, box.y + y, { steps: 10 });
      }
    }

    await page.mouse.up();
  },

  // 전체 50% 채워지는 줄무늬 그리기 (Mouse move)
  differentByMouse: async (page: Page, clientIndex?: number) => {
    if (!clientIndex) return;
    const box = await page.locator('canvas').boundingBox();
    if (!box) throw new Error('Canvas not found');

    // 클라이언트 인덱스에 따라 다른 시작점
    const isEvenClient = clientIndex % 2 === 0;
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();

    // 짝수 클라이언트는 가로줄, 홀수 클라이언트는 세로줄
    if (isEvenClient) {
      // 가로 방향으로 전체를 채움
      for (let y = 0; y < box.height; y += 20) {
        for (let x = 0; x < box.width; x += 10) {
          await page.mouse.move(box.x + x, box.y + y, { steps: 1000 });
        }
      }
    } else {
      // 세로 방향으로 전체를 채움
      for (let x = 0; x < box.width; x += 20) {
        for (let y = 0; y < box.height; y += 10) {
          await page.mouse.move(box.x + x, box.y + y, { steps: 1000 });
        }
      }
    }

    await page.mouse.up();
  },

  // 랜덤 드로잉
  // randomByMouse: async (page: Page) => {
  //   const box = await page.locator('canvas').boundingBox();
  //   if (!box) throw new Error('Canvas not found');

  //   const points = Array.from({ length: 10 }, () => ({
  //     x: Math.random() * box.width,
  //     y: Math.random() * box.height,
  //   }));

  //   await page.mouse.down();

  //   for (let i = 1; i < points.length; i++) {
  //     await page.mouse.move(points[i].x, points[i].y, { steps: 5 });
  //   }

  //   await page.mouse.up();
  // },

  randomByMouse: async (page: Page) => {
    const box = await page.locator('canvas').boundingBox();
    if (!box) throw new Error('Canvas not found');

    // 안전한 드로잉 영역 계산 (캔버스 가장자리 10% 제외)
    const margin = {
      x: box.width * 0.1,
      y: box.height * 0.1,
    };

    const safeArea = {
      x: box.x + margin.x,
      y: box.y + margin.y,
      width: box.width - margin.x * 2,
      height: box.height - margin.y * 2,
    };

    // 캔버스 영역 내 랜덤 점들 생성
    const points = Array.from({ length: 10 }, () => ({
      x: safeArea.x + Math.random() * safeArea.width,
      y: safeArea.y + Math.random() * safeArea.height,
    }));

    // 시작 전 마우스를 첫 번째 점으로 이동
    await page.mouse.move(points[0].x, points[0].y);
    await page.mouse.down();

    // 각 점 연결하며 그리기
    for (let i = 1; i < points.length; i++) {
      await page.mouse.move(points[i].x, points[i].y, {
        steps: 50,
      });
    }

    await page.mouse.up();
  },
};
