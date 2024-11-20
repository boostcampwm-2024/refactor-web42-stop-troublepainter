import '@/App.css';
import { useState } from 'react';
import asdf from '@/assets/big-timer.gif';
import helpIcon from '@/assets/help-icon.svg';
import asd from '@/assets/small-timer.gif';
import as from '@/assets/small-timer.png';
import { GameCanvas } from '@/components/canvas/GameCanvasExample';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Modal } from '@/components/ui/Modal';
import { UserInfoCard } from '@/components/ui/UserInfoCard';
import { useModal } from '@/hooks/useModal';
import { PlayerRole } from '@/types/gameShared.types';

const ExamplePage = () => {
  const [isReady, setIsReady] = useState(false);
  const { isModalOpened, openModal } = useModal(3000);
  const { isModalOpened: isModalOpened2, openModal: openModal2, closeModal } = useModal();

  return (
    <main className="bg-eastbay-600">
      <Logo />
      <Logo variant="side" />
      <div className="flex items-center justify-center">
        <GameCanvas role={PlayerRole.PAINTER} />
      </div>

      <h1 className="justify-center">Hello world!</h1>
      <Button className="font-neodgm-pro text-2xl font-normal">유미라</Button>
      <Button variant="transperent" size="icon">
        <img src={helpIcon} alt="도움말 보기 버튼" />
      </Button>
      {/* UserInfoCard 예시 */}
      <div className="space-y-8 p-4">
        {/* 대기방 예시 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">대기방</h2>
          <div className="space-y-2">
            <UserInfoCard username="미라" status={isReady ? 'READY' : 'NOT_READY'} />
            <UserInfoCard username="친구" status={'NOT_READY'} />
          </div>
          <Button onClick={() => setIsReady(!isReady)} variant={isReady ? 'secondary' : 'primary'} className="w-full">
            {isReady ? '해제' : '준비'}
          </Button>
        </div>

        {/* 게임방 예시 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">게임방</h2>
          <div className="space-y-2">
            <UserInfoCard username="미라" status="PLAYING" role={PlayerRole.PAINTER} score={80} rank={0} />
            <UserInfoCard username="친구1" status="PLAYING" role={PlayerRole.DEVIL} score={8} rank={1} />
            <UserInfoCard username="친구2" status="PLAYING" role={PlayerRole.PAINTER} score={6} rank={2} />
            <UserInfoCard username="친구3" status="PLAYING" role={PlayerRole.GUESSER} score={4} />
          </div>
        </div>
      </div>
      <img src={as} alt="as" />
      <img src={asd} alt="asd" />
      <img src={asdf} alt="asdf" />

      {/* Role 모달 */}
      <button onClick={openModal}>3초 후 사라지는 Role 모달 오픈</button>
      <Modal title="역할 배정" isModalOpened={isModalOpened} className="w-80">
        <span className="flex min-h-28 items-center justify-center text-3xl text-violet-950">그림꾼</span>
      </Modal>

      {/* 라운드 종료 모달 */}
      <button onClick={openModal2}>라운드 종료 모달 오픈</button>
      <Modal
        title="제시어 : 티라노사우르스"
        isModalOpened={isModalOpened2}
        closeModal={closeModal}
        className="max-w-[26.875rem] sm:max-w-[61.75rem]"
      >
        <div className="flex min-h-[12rem] items-center justify-center sm:min-h-[15.75rem]">
          <p className="text-center text-2xl sm:m-2 sm:text-3xl">
            구경꾼 <span className="text-violet-600">태연태연</span>이 정답을 맞혔습니다
          </p>
        </div>
        <div className="min-h-[4rem] rounded-md bg-violet-50 p-4 sm:m-2">
          <p className="text-center text-xl text-violet-950 sm:text-2xl">
            방해꾼은 <span className="text-violet-600">미라미라</span>였습니다.
          </p>
        </div>
      </Modal>
    </main>
  );
};

export default ExamplePage;
