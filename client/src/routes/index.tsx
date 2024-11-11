import { createBrowserRouter } from 'react-router-dom';
import ExamplePage from '@/pages/ExamplePage';
import MainPage from '@/pages/MainPage';
// import WaitingRoomPage from '@/pages/WaitingRoomPage';
// import GameRoomPage from '@/pages/GameRoomPage';
// import ResultPage from '@/pages/ResultPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
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
  {
    path: '/dev',
    element: <ExamplePage />,
  },
]);
