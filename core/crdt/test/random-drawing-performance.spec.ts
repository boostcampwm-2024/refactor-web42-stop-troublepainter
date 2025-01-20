import { test as base, Page, chromium, BrowserContext } from '@playwright/test';
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

  const browser = await chromium.launch();
  const contexts = await Promise.all(
    Array(5)
      .fill(browser)
      .map((e) => e.newContext()),
  );

  // 호스트 설정
  const hostPage = await contexts[0].newPage();
  await hostPage.goto(baseUrl);
  await hostPage.getByRole('button', { name: '방 만들기' }).click();
  await hostPage.waitForURL('**/lobby/*');
  const roomUrl = hostPage.url();

  clients.push({
    page: hostPage,
    context: contexts[0],
    isHost: true,
  });

  // 나머지 클라이언트 접속
  clients.push(
    ...(await Promise.all(
      contexts.slice(1).map(async (context) => {
        const page = await context.newPage();
        await page.goto(roomUrl);
        return {
          page,
          context,
          isHost: false,
        };
      }),
    )),
  );

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

        const painterRole = client.page.locator('#modal-root').getByText('그림꾼', { exact: true });
        const devilRole = client.page.locator('#modal-root').getByText('방해꾼', { exact: true });
        const guesserRole = client.page.locator('#modal-root').getByText('구경꾼', { exact: true });

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

  test('Drawing performance test with multiple browsers', async () => {
    try {
      // 셋업 및 모달 처리
      const TEST_URL = 'http://localhost:5173';
      clients = await setupTestRoom(TEST_URL);
      const drawers = clients.filter((client) => ['PAINTER', 'DEVIL'].includes(client.role || ''));

      // 모달 닫힌 후 시작 시간 기록
      const testStartTime = performance.now();

      // 1단계: 처음 5초 대기
      const waitEndTime = testStartTime + 1000;
      console.log('Waiting 5 seconds before drawing...');
      while (performance.now() < waitEndTime) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 성능 측정 시작
      const cdpSessions = await Promise.all(clients.map((e) => e.context.newCDPSession(e.page)));
      await Promise.all(cdpSessions.map((e) => e.send('Emulation.setCPUThrottlingRate', { rate: 2 })));
      console.log('Emulation.setCPUThrottlingRate');
      await Promise.all(cdpSessions.map((e) => e.send('Performance.enable')));
      console.log('Performance.enable');

      // 2단계: 30초 동안 드로잉
      const drawingTime = 20000;
      const drawingStartTime = performance.now();
      console.log('Starting 30 seconds drawing phase...');
      const DRAW_COUNT = 20;
      let curDrawCount = 0;
      while (curDrawCount < DRAW_COUNT) {
        if (performance.now() - drawingStartTime < drawingTime * (curDrawCount / DRAW_COUNT)) continue;
        console.log(curDrawCount++);
        await Promise.all(
          drawers.map(async (drawer) => {
            try {
              if (!drawer.page.isClosed()) {
                await drawingPatterns.randomByMouse(drawer.page);
              }
            } catch (error) {
              console.error(`Drawing failed for ${drawer.role}:`, error);
            }
          }),
        );
      }

      // 성능 측정 종료
      const METRIC_FILTER = [
        'LayoutCount',
        'RecalcStyleCount',
        'LayoutDuration',
        'RecalcStyleDuration',
        'ScriptDuration',
        'V8CompileDuration',
        'TaskDuration',
        'TaskOtherDuration',
        'DevToolsCommandDuration',
        'ThreadTime',
        'ProcessTime',
        'JSHeapUsedSize',
        'JSHeapTotalSize',
      ];
      const compareMetric = METRIC_FILTER.reduce(
        (acc, cur) => {
          acc[cur] = [0, 0];
          return acc;
        },
        {} as Record<string, [number, number]>,
      );
      const performanceMetrics = await Promise.all(cdpSessions.map((e) => e.send('Performance.getMetrics')));
      performanceMetrics.forEach((e, index) =>
        e.metrics.forEach((metric) => {
          if (METRIC_FILTER.includes(metric.name)) {
            compareMetric[metric.name][clients[index].role === 'GUESSER' ? 1 : 0] += metric.value;
          }
        }),
      );
      Object.values(compareMetric).forEach((e) => {
        e[0] /= drawers.length; //DRAWER 3명
        e[1] /= clients.length - drawers.length; //GUESSER 2명
      });
      console.log(JSON.stringify(compareMetric, null, 4));

      // 테스트 종료
      await Promise.all(clients.map((e) => e.context.close()));
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
