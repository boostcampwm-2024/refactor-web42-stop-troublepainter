import { createBrowserRouter } from 'react-router-dom';
import GameLayout from '@/layouts/GameLayout';
import RootLayout from '@/layouts/RootLayout';
import ExamplePage from '@/pages/ExamplePage';
import MainPage from '@/pages/MainPage';
// import WaitingRoomPage from '@/pages/WaitingRoomPage';
// import GameRoomPage from '@/pages/GameRoomPage';
// import ResultPage from '@/pages/ResultPage';

export const router = createBrowserRouter([
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
            path: '/devs',
            element: <ExamplePage />,
          },
          // {
          //   path: '/room/:roomId',
          //   element: <WaitingRoomPage />,
          // },
          // {
          //   path: '/game/:roomId',
          //   element: <GameRoomPage />,
          // },
          // {
          //   path: '/result/:roomId',
          //   element: <ResultPage />,
          // },
        ],
      },
      // 개발용 페이지
      {
        path: '/dev',
        element: <ExamplePage />,
      },
    ],
  },
]);
