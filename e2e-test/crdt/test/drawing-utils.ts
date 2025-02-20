import { Page } from '@playwright/test';
import { DrawingFunction } from './test-types';

let initialSeed = 825347;
const seedMap = new Map();
function seedRandom(key: any) {
  if (!seedMap.has(key)) seedMap.set(key, initialSeed);
  let seed = seedMap.get(key);
  initialSeed *= 6807;
  seed = (seed * 16807) % 2147483647;
  seedMap.set(key, seed);
  return (seed - 1) / 2147483646;
}

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

async function drawWithFillMode(page: Page, point: { x: number; y: number }) {
  // 채우기 모드에서는 mousedown 이벤트 하나만 필요
  await page.dispatchEvent('canvas', 'mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: point.x,
    clientY: point.y,
    buttons: 1, // 마우스 왼쪽 버튼
  });

  // mouseup은 필요할 수 있음
  await page.dispatchEvent('canvas', 'mouseup', {
    bubbles: true,
    cancelable: true,
    clientX: point.x,
    clientY: point.y,
  });
}

export async function drawEventData(page: Page, eventData: any[]) {
  const CANVAS_SELECTOR = 'canvas + canvas';
  const canvas = page.locator(CANVAS_SELECTOR);
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas not found');

  const margin = {
    x: box.width * 0.05,
    y: box.height * 0.05,
  };

  const safeArea = {
    x: box.x + margin.x,
    y: box.y + margin.y,
    width: box.width - margin.x * 2,
    height: box.height - margin.y * 2,
  };

  let delayOfDelay = 0;

  for (const event of eventData) {
    const [eventName, pos, delay] = event;
    const convertedPos = [safeArea.x + pos[0] * safeArea.width, safeArea.y + pos[1] * safeArea.height];

    canvas.dispatchEvent('mouse' + eventName, {
      bubbles: true,
      cancelable: true,
      clientX: convertedPos[0],
      clientY: convertedPos[1],
    });

    const startDelay = performance.now();
    if (delay - delayOfDelay > 0) await new Promise((res) => setTimeout(res, delay - delayOfDelay));
    delayOfDelay = Math.floor(performance.now() - startDelay) - delay;
    if (delayOfDelay < 0) delayOfDelay = 0;
  }

  console.log('드로잉 종료');
}

export const drawingPatterns: Record<string, DrawingFunction> = {
  // 랜덤 드로잉 (Mouse events)
  randomByMouse: async (page: Page) => {
    const CANVAS_SELECTOR = 'canvas + canvas';
    const canvas = page.locator(CANVAS_SELECTOR);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    // 1. 랜덤 설정 적용
    if (seedRandom(page) > 0.5) await selectRandomColor(page);
    if (seedRandom(page) > 0.7) await setRandomLineWidth(page);
    // if (seedRandom(page) > 0.8) await toggleFillMode(page);

    const margin = {
      x: box.width * 0.05,
      y: box.height * 0.05,
    };

    const safeArea = {
      x: box.x + margin.x,
      y: box.y + margin.y,
      width: box.width - margin.x * 2,
      height: box.height - margin.y * 2,
    };

    // 2. 랜덤 드로잉 패턴 선택
    const patternType = Math.floor(seedRandom(page) * 4); // 0-3까지로 확장

    switch (patternType) {
      case 0: // 단일 선
        {
          const startPoint = {
            x: safeArea.x + seedRandom(page) * safeArea.width,
            y: safeArea.y + seedRandom(page) * safeArea.height,
          };
          const endPoint = {
            x: safeArea.x + seedRandom(page) * safeArea.width,
            y: safeArea.y + seedRandom(page) * safeArea.height,
          };

          await canvas.dispatchEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: startPoint.x,
            clientY: startPoint.y,
          });

          await canvas.dispatchEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: endPoint.x,
            clientY: endPoint.y,
          });

          await canvas.dispatchEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            clientX: endPoint.x,
            clientY: endPoint.y,
          });
        }
        break;

      case 1: // 여러 점 연결
        {
          const points = Array.from({ length: Math.floor(seedRandom(page) * 5) + 3 }, () => ({
            x: safeArea.x + seedRandom(page) * safeArea.width,
            y: safeArea.y + seedRandom(page) * safeArea.height,
          }));

          await canvas.dispatchEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: points[0].x,
            clientY: points[0].y,
          });

          for (let i = 1; i < points.length; i++) {
            await canvas.dispatchEvent('mousemove', {
              bubbles: true,
              cancelable: true,
              clientX: points[i].x,
              clientY: points[i].y,
            });
            await page.waitForTimeout(50);
          }

          await canvas.dispatchEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            clientX: points[points.length - 1].x,
            clientY: points[points.length - 1].y,
          });
        }
        break;

      case 2: // 곡선 그리기
        {
          const centerX = safeArea.x + safeArea.width / 2;
          const centerY = safeArea.y + safeArea.height / 2;
          const radius = Math.min(safeArea.width, safeArea.height) / 4;
          const points = Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            return {
              x: centerX + Math.cos(angle) * radius * (0.8 + seedRandom(page) * 0.4),
              y: centerY + Math.sin(angle) * radius * (0.8 + seedRandom(page) * 0.4),
            };
          });

          await canvas.dispatchEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: points[0].x,
            clientY: points[0].y,
          });

          for (const point of points) {
            await canvas.dispatchEvent('mousemove', {
              bubbles: true,
              cancelable: true,
              clientX: point.x,
              clientY: point.y,
            });
            await page.waitForTimeout(20);
          }

          await canvas.dispatchEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            clientX: points[points.length - 1].x,
            clientY: points[points.length - 1].y,
          });
        }
        break;

      case 3: // 채우기 모드로 랜덤한 위치 채우기
        return;
        {
          const fillPoint = {
            x: safeArea.x + seedRandom(page) * safeArea.width,
            y: safeArea.y + seedRandom(page) * safeArea.height,
          };

          // 채우기 모드 활성화
          const fillButton = page.getByLabel('채우기 모드');
          await fillButton.click();

          await drawWithFillMode(page, fillPoint);
        }
        break;
    }

    // 3. 랜덤하게 되돌리기/다시실행 수행
    // if (seedRandom(page) > 0.9) {
    //   await performUndoRedo(page);
    // }
  },
};

async function selectRandomColor(page: Page): Promise<void> {
  const colors = ['검정', '분홍', '노랑', '하늘', '회색'];
  const randomColor = colors[Math.floor(seedRandom(page) * colors.length)];
  await page.getByLabel(`${randomColor} 색상 선택`).click({ force: true });
}

async function setRandomLineWidth(page: Page): Promise<void> {
  await page.getByLabel('펜 모드').click({ force: true });
  const lineWidth = Math.floor(seedRandom(page) * 9) * 2 + 4; // 4-20 사이의 짝수 값
  await page.getByLabel('선 굵기 조절').fill(lineWidth.toString());
}

async function toggleFillMode(page: Page): Promise<void> {
  await page.getByLabel('채우기 모드').click({ force: true });
}

async function performUndoRedo(page: Page): Promise<void> {
  const undoButton = page.getByLabel('되돌리기');
  const isUndoEnabled = await undoButton.isEnabled();

  if (isUndoEnabled) {
    await undoButton.click();

    const redoButton = page.getByLabel('다시실행');
    const isRedoEnabled = await redoButton.isEnabled();

    if (isRedoEnabled && seedRandom(page) > 0.5) {
      await redoButton.click();
    }
  }
}
