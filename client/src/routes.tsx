import { createBrowserRouter } from 'react-router-dom';
import GameLayout from '@/layouts/GameLayout';
import RootLayout from '@/layouts/RootLayout';
import ExamplePageCanvasOnly from '@/pages/ExamplePageCanvasOnly';
import GameRoomPage from '@/pages/GameRoomPage';
import LobbyPage from '@/pages/LobbyPage';
import MainPage from '@/pages/MainPage';
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
              path: '/lobby/:roomId',
              element: <LobbyPage />,
            },
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
