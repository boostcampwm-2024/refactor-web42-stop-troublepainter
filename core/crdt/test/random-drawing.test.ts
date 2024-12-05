import { test as base, expect, Page, chromium, BrowserContext, firefox, webkit } from '@playwright/test';
import { compareByPng } from './test-utils';
import { drawingPatterns } from './drawing-utils';

interface TestClient {
  page: Page;
  context: BrowserContext;
  role?: string;
  isHost: boolean;
}

const test = base.extend({});

async function setupTestRoom(baseUrl: string): Promise<TestClient[]> {
  const clients: TestClient[] = [];

  const contexts = await Promise.all([
    chromium.launchPersistentContext('./test-user-data-1', {}),
    chromium.launchPersistentContext('./test-user-data-2', {}),
    chromium.launchPersistentContext('./test-user-data-3', {}),
    chromium.launchPersistentContext('./test-user-data-4', {}),
    chromium.launchPersistentContext('./test-user-data-5', {}),
  ]);

  // 호스트 설정
  const hostPage = await contexts[0].newPage();
  await hostPage.goto(baseUrl);
  await hostPage.getByRole('button', { name: '방 만들기' }).click();
  await hostPage.getByRole('button', { name: '복사 완료! 🔗 초대' }).click();
  const roomUrl = hostPage.url();

  clients.push({
    page: hostPage,
    context: contexts[0],
    isHost: true,
  });

  // 나머지 클라이언트 접속
  for (let i = 1; i < contexts.length; i++) {
    const page = await contexts[i].newPage();
    await page.goto(roomUrl);
    clients.push({
      page,
      context: contexts[i],
      isHost: false,
    });
  }

  // 호스트가 게임 시작
  await clients[0].page.getByRole('button', { name: '게임 시작' }).click();
  await clients[0].page.getByText('곧 게임이 시작됩니다!').waitFor({ state: 'visible' });

  // 게임 화면으로 전환
  await Promise.all(clients.map((client) => client.page.waitForURL((url) => url.toString().includes('/game/'))));

  // 각 클라이언트의 역할 모달 대기 및 역할 확인
  await Promise.all(
    clients.map(async (client) => {
      try {
        await client.page.waitForSelector('#modal-root > *', {
          timeout: 30000,
          state: 'visible',
        });

        const painterRole = await client.page.locator('#modal-root').getByText('그림꾼', { exact: true });
        const devilRole = await client.page.locator('#modal-root').getByText('방해꾼', { exact: true });
        const guesserRole = await client.page.locator('#modal-root').getByText('구경꾼', { exact: true });

        const isPainter = (await painterRole.count()) > 0;
        const isDevil = (await devilRole.count()) > 0;
        const isGuesser = (await guesserRole.count()) > 0;

        if (isPainter) {
          client.role = 'PAINTER';
          await painterRole.click();
        } else if (isDevil) {
          client.role = 'DEVIL';
          await devilRole.click();
        } else if (isGuesser) {
          client.role = 'GUESSER';
          await guesserRole.click();
        }

        console.log(`Client assigned role: ${client.role}`);
      } catch (error) {
        console.error(`Modal detection failed for client:`, error);
        throw error;
      }
    }),
  );

  return clients;
}

test.describe('Game Room Drawing Test', () => {
  let clients: TestClient[] = [];

  test.afterEach(async () => {
    for (const client of clients) {
      try {
        if (!client.page.isClosed()) {
          await client.page.close();
        }
        await client.context.close();
      } catch (error) {
        console.error('Cleanup failed:', error);
      }
    }
    clients = [];
  });

  test('Drawing synchronization test with multiple browsers', async () => {
    try {
      // 셋업 및 모달 처리
      clients = await setupTestRoom('http://localhost:5173');
      const drawers = clients.filter((client) => ['PAINTER', 'DEVIL'].includes(client.role || ''));

      // 모달 닫힌 후 시작 시간 기록
      const testStartTime = Date.now();

      // 1단계: 처음 5초 대기
      // const waitEndTime = testStartTime + 5000;
      const waitEndTime = testStartTime + 1000;
      console.log('Waiting 5 seconds before drawing...');
      while (Date.now() < waitEndTime) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 2단계: 30초 동안 드로잉
      const drawingEndTime = waitEndTime + 30000;
      console.log('Starting 30 seconds drawing phase...');
      while (Date.now() < drawingEndTime) {
        await Promise.all(
          drawers.map(async (drawer) => {
            try {
              if (!drawer.page.isClosed()) {
                await drawingPatterns.randomByMouse(drawer.page);
                await drawer.page.waitForTimeout(100);
              }
            } catch (error) {
              console.error(`Drawing failed for ${drawer.role}:`, error);
            }
          }),
        );
      }

      // 3단계: 남은 15초 동안 캔버스 비교
      console.log('Starting canvas comparison phase...');
      if (drawers.length > 0) {
        const baseCanvas = drawers[0].page;
        for (const client of clients.slice(1)) {
          if (!client.page.isClosed() && !baseCanvas.isClosed()) {
            const diffRatio = await compareByPng(baseCanvas, client.page);
            console.log(`Client (Role: ${client.role}) final canvas diff ratio: ${diffRatio}`);
            expect(diffRatio).toBeLessThanOrEqual(0.01);
          }
        }
      }

      // 전체 테스트 시간이 50초를 넘으면 안됨
      const elapsedTime = Date.now() - testStartTime;
      if (elapsedTime > 50000) {
        throw new Error(`Test exceeded 50 seconds: ${elapsedTime}ms`);
      }
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
