import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

const MainPage = () => {
  return (
    <main className="flex h-screen items-center justify-center bg-gradient-to-b from-violet-950 via-violet-800 to-fuchsia-700">
      <div className="flex h-full flex-col items-center justify-center gap-16">
        <Logo variant="main" />
        <Button className="h-16 max-w-96">방 만들기</Button>
      </div>
    </main>
  );
};

export default MainPage;
