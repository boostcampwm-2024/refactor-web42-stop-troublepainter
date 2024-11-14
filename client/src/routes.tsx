import { createBrowserRouter } from 'react-router-dom';
import GameLayout from '@/layouts/GameLayout';
import RootLayout from '@/layouts/RootLayout';
import ExamplePage from '@/pages/ExamplePage';
import ExamplePageCanvasOnly from '@/pages/ExamplePageCanvasOnly';
import GameRoomPage from '@/pages/GameRoomPage';
import MainPage from '@/pages/MainPage';
// import WaitingRoomPage from '@/pages/WaitingRoomPage';
// import GameRoomPage from '@/pages/GameRoomPage';
// import ResultPage from '@/pages/ResultPage';

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          path: '/',
          element: <MainPage />,
        },
        {
          element: <GameLayout />,
          children: [
            {
              path: '/game-examples',
              element: <ExamplePage />,
            },
            // {
            //   path: '/game-room/:roomId',
            //   element: <WaitingRoomPage />,
            // },
            {
              path: '/game-match/:roomId',
              element: <GameRoomPage />,
            },
            // {
            //   path: '/game-result/:roomId',
            //   element: <ResultPage />,
            // },
          ],
        },
        // 개발용 페이지
        {
          path: '/examples',
          element: <ExamplePage />,
        },
        {
          path: '/dev/canvas',
          element: <ExamplePageCanvasOnly />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
    },
  },
);
