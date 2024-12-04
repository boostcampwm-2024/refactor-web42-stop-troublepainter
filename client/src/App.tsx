import { ReactNode } from 'react';
import { ToastContainer } from '@/components/toast/ToastContainer';

interface AppChildrenProps {
  children: ReactNode;
}

// 전역 상태 등 추가할 예정
const App = ({ children }: AppChildrenProps) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

export default App;
