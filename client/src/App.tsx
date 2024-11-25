import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Query 클라이언트 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

interface AppChildrenProps {
  children: ReactNode;
}

// 전역 상태 등 추가할 예정
const AppProvider = ({ children }: AppChildrenProps) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

// ErrorBoundary, 모달 등 추가할 예정
const App = ({ children }: AppChildrenProps) => {
  return <AppProvider>{children}</AppProvider>;
};

export default App;
