import { Page } from '@playwright/test';
import { PNG } from 'pngjs';

// 2. PNG 해시값 비교
export const compareByPng = async (basePage: Page, targetPage: Page): Promise<number> => {
  // 임시 대기 시간 추가
  await Promise.all([basePage.waitForTimeout(100), targetPage.waitForTimeout(100)]);

  const screenshot1 = await basePage.locator('canvas:first-child').screenshot();
  const screenshot2 = await targetPage.locator('canvas:first-child').screenshot();

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

// 공통 비교 함수 타입 정의
export type CompareFunction = (basePage: Page, targetPage: Page) => Promise<number>;
