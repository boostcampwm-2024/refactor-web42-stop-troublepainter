import { createBrowserRouter } from 'react-router-dom';
import GameLayout from '@/layouts/GameLayout';
import RootLayout from '@/layouts/RootLayout';
import ExamplePage from '@/pages/ExamplePage';
import ExamplePageCanvasOnly from '@/pages/ExamplePageCanvasOnly';
import GameRoomPage from '@/pages/GameRoomPage';
import MainPage from '@/pages/MainPage';
// import LobbyPage from '@/pages/LobbyPage';
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
            //   path: '/lobby/:roomId',
            //   element: <LobbyPage />,
            // },
            {
              path: '/game/:roomId',
              element: <GameRoomPage />,
            },
          ],
        },
        // {
        //   path: '/game/:roomId/result',
        //   element: <ResultPage />,
        // },
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
