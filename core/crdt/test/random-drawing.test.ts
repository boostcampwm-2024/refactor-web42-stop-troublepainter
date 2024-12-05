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
      await client.page.close();
      await client.context.close();
    }
    clients = [];
  });

  test('Drawing synchronization test with multiple browsers', async () => {
    // 브라우저 콘솔 로그 캡처
    clients.forEach((client) => {
      client.page.on('console', (msg) => {
        console.log(`Browser console [${client.role}]:`, msg.text());
      });
    });

    // 테스트 타임아웃 설정
    test.setTimeout(60000);

    clients = await setupTestRoom('http://localhost:5173');

    const drawers = clients.filter((client) => ['PAINTER', 'DEVIL'].includes(client.role || ''));
    console.log(
      'Role distribution:',
      clients.map((c) => `Role: ${c.role}`),
    );

    // 그림꾼과 방해꾼만 캔버스가 보이는 35초 동안 랜덤하게 그리기
    const drawingStartTime = Date.now();
    const drawingTime = 35000; // 35초

    while (Date.now() - drawingStartTime < drawingTime) {
      await Promise.all(
        drawers.map(async (drawer) => {
          try {
            await drawingPatterns.randomByMouse(drawer.page);
            // 각 드로잉 사이에 짧은 대기 시간
            await drawer.page.waitForTimeout(Math.random() * 500 + 100);
          } catch (error) {
            console.error(`Drawing failed for ${drawer.role}:`, error);
          }
        }),
      );
    }

    console.log('Drawing phase completed, waiting for canvas reveal...');

    // 15초 공개 시간의 시작 부분에서 모든 클라이언트의 캔버스 상태 비교
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (drawers.length > 0) {
      const baseCanvas = drawers[0].page;
      for (const client of clients.slice(1)) {
        const diffRatio = await compareByPng(baseCanvas, client.page);
        console.log(`Client (Role: ${client.role}) final canvas diff ratio: ${diffRatio}`);
        expect(diffRatio).toBeLessThanOrEqual(0.01);
      }
    }
  });
});
