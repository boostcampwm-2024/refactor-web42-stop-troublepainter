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

async function drawWithFillMode(page: Page, point: { x: number; y: number }): Promise<void> {
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

export const drawingPatterns: Record<string, DrawingFunction> = {
  // 동일한 사각형 그리기 (fillRect)
  identicalByRect: async (page: Page) => {
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get 2d context');

      ctx.beginPath();
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
          for (let y = 0; y < canvas.height; y += 20) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, y, canvas.width, 10);
          }
        } else {
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

  // 동일한 사각형 그리기 (Mouse events)
  identicalByMouse: async (page: Page) => {
    const canvas = await page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    await page.dispatchEvent('canvas', 'mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: box.x,
      clientY: box.y,
    });

    for (let x = 0; x < box.width; x += 10) {
      for (let y = 0; y < box.height; y += 10) {
        await page.dispatchEvent('canvas', 'mousemove', {
          bubbles: true,
          cancelable: true,
          clientX: box.x + x,
          clientY: box.y + y,
        });
        await page.waitForTimeout(10);
      }
    }

    await page.dispatchEvent('canvas', 'mouseup', {
      bubbles: true,
      cancelable: true,
      clientX: box.x + box.width,
      clientY: box.y + box.height,
    });
  },

  // 전체 50% 채워지는 줄무늬 그리기 (Mouse events)
  differentByMouse: async (page: Page, clientIndex?: number) => {
    if (!clientIndex) return;
    const canvas = await page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const isEvenClient = clientIndex % 2 === 0;

    await page.dispatchEvent('canvas', 'mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: box.x,
      clientY: box.y,
    });

    if (isEvenClient) {
      for (let y = 0; y < box.height; y += 20) {
        for (let x = 0; x < box.width; x += 10) {
          await page.dispatchEvent('canvas', 'mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: box.x + x,
            clientY: box.y + y,
          });
          await page.waitForTimeout(10);
        }
      }
    } else {
      for (let x = 0; x < box.width; x += 20) {
        for (let y = 0; y < box.height; y += 10) {
          await page.dispatchEvent('canvas', 'mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: box.x + x,
            clientY: box.y + y,
          });
          await page.waitForTimeout(10);
        }
      }
    }

    await page.dispatchEvent('canvas', 'mouseup', {
      bubbles: true,
      cancelable: true,
      clientX: box.x + (isEvenClient ? box.width : 20),
      clientY: box.y + (isEvenClient ? 20 : box.height),
    });
  },

  // 랜덤 드로잉 (Mouse events)
  randomByMouse: async (page: Page) => {
    const canvas = await page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    // 1. 랜덤 설정 적용
    if (Math.random() > 0.5) await selectRandomColor(page);
    if (Math.random() > 0.7) await setRandomLineWidth(page);
    if (Math.random() > 0.8) await toggleFillMode(page);

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
    const patternType = Math.floor(Math.random() * 4); // 0-3까지로 확장

    switch (patternType) {
      case 0: // 단일 선
        {
          const startPoint = {
            x: safeArea.x + Math.random() * safeArea.width,
            y: safeArea.y + Math.random() * safeArea.height,
          };
          const endPoint = {
            x: safeArea.x + Math.random() * safeArea.width,
            y: safeArea.y + Math.random() * safeArea.height,
          };

          await page.dispatchEvent('canvas', 'mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: startPoint.x,
            clientY: startPoint.y,
          });

          await page.dispatchEvent('canvas', 'mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: endPoint.x,
            clientY: endPoint.y,
          });

          await page.dispatchEvent('canvas', 'mouseup', {
            bubbles: true,
            cancelable: true,
            clientX: endPoint.x,
            clientY: endPoint.y,
          });
        }
        break;

      case 1: // 여러 점 연결
        {
          const points = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => ({
            x: safeArea.x + Math.random() * safeArea.width,
            y: safeArea.y + Math.random() * safeArea.height,
          }));

          await page.dispatchEvent('canvas', 'mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: points[0].x,
            clientY: points[0].y,
          });

          for (let i = 1; i < points.length; i++) {
            await page.dispatchEvent('canvas', 'mousemove', {
              bubbles: true,
              cancelable: true,
              clientX: points[i].x,
              clientY: points[i].y,
            });
            await page.waitForTimeout(50);
          }

          await page.dispatchEvent('canvas', 'mouseup', {
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
              x: centerX + Math.cos(angle) * radius * (0.8 + Math.random() * 0.4),
              y: centerY + Math.sin(angle) * radius * (0.8 + Math.random() * 0.4),
            };
          });

          await page.dispatchEvent('canvas', 'mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: points[0].x,
            clientY: points[0].y,
          });

          for (const point of points) {
            await page.dispatchEvent('canvas', 'mousemove', {
              bubbles: true,
              cancelable: true,
              clientX: point.x,
              clientY: point.y,
            });
            await page.waitForTimeout(20);
          }

          await page.dispatchEvent('canvas', 'mouseup', {
            bubbles: true,
            cancelable: true,
            clientX: points[points.length - 1].x,
            clientY: points[points.length - 1].y,
          });
        }
        break;

      case 3: // 채우기 모드로 랜덤한 위치 채우기
        {
          const fillPoint = {
            x: safeArea.x + Math.random() * safeArea.width,
            y: safeArea.y + Math.random() * safeArea.height,
          };

          // 채우기 모드 활성화
          const fillButton = page.getByLabel('채우기 모드');
          await fillButton.click();

          await drawWithFillMode(page, fillPoint);
        }
        break;
    }

    // 3. 랜덤하게 되돌리기/다시실행 수행
    if (Math.random() > 0.7) {
      await performUndoRedo(page);
    }
  },
};

async function selectRandomColor(page: Page): Promise<void> {
  const colors = ['검정', '분홍', '노랑', '하늘', '회색'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  await page.getByLabel(`${randomColor} 색상 선택`).click();
}

async function setRandomLineWidth(page: Page): Promise<void> {
  await page.getByLabel('펜 모드').click();
  const lineWidth = Math.floor(Math.random() * 9) * 2 + 4; // 4-20 사이의 짝수 값
  await page.getByLabel('선 굵기 조절').fill(lineWidth.toString());
}

async function toggleFillMode(page: Page): Promise<void> {
  await page.getByLabel('채우기 모드').click();
}

async function performUndoRedo(page: Page): Promise<void> {
  const undoButton = page.getByLabel('되돌리기');
  const isUndoEnabled = await undoButton.isEnabled();

  if (isUndoEnabled) {
    await undoButton.click();

    const redoButton = page.getByLabel('다시실행');
    const isRedoEnabled = await redoButton.isEnabled();

    if (isRedoEnabled && Math.random() > 0.5) {
      await redoButton.click();
    }
  }
}
