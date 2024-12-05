import { KeyboardEvent, useEffect, useState, TouchEvent, useRef, RefObject } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import left from '@/assets/left.svg';
import fifth from '@/assets/lottie/help/fifth.json';
import first from '@/assets/lottie/help/first.json';
import fourth from '@/assets/lottie/help/fourth.json';
import second from '@/assets/lottie/help/second.json';
import third from '@/assets/lottie/help/third.json';
import right from '@/assets/right.svg';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';

interface HelpRollingModalProps {
  isModalOpened: boolean;
  handleCloseModal: () => void;
  handleKeyDown: (e: KeyboardEvent<Element>) => void;
}

interface PageData {
  img: string | object;
  contents: string[];
}

const pageData: PageData[] = [
  {
    img: first,
    contents: ['게임을 함께 할 친구를 모으세요.', '그리고 게임 시작을 누르세요.'],
  },
  {
    img: second,
    contents: ['그림꾼은 제시어를 표현하세요.', '방해꾼은 그림꾼을 방해하세요.'],
  },
  {
    img: third,
    contents: [
      '구경꾼은 타이머 종료 후 제시어를 맞추세요.',
      '정답이면 맞춘 구경꾼과 그림꾼이 점수를 얻고,',
      '오답이면 방해꾼이 점수를 얻어요.',
    ],
  },
  {
    img: fourth,
    contents: ['설정한 라운드 수 만큼 게임을 즐기세요.', '매 라운드 마다 역할이 바뀌어요.'],
  },
  {
    img: fifth,
    contents: ['시상대에서 승리의 기쁨을 누리세요.', '1등이 아니라면 다음 게임을 노려보세요.'],
  },
];

const HelpPage = ({ pageData, playerRef }: { pageData: PageData; playerRef: RefObject<Player> }) => {
  return (
    <article className="relative">
      <Player src={pageData.img} autoplay={true} loop={true} ref={playerRef} style={{ height: 300 }} />

      <div className="flex flex-col items-center justify-center rounded-md bg-violet-50 py-6">
        {pageData.contents.map((line, i) => (
          <p key={i} className="text-base md:text-lg lg:text-xl xl:text-2xl">
            {line}
          </p>
        ))}
      </div>
    </article>
  );
};

const HelpRollingModal = ({ isModalOpened, handleCloseModal, handleKeyDown }: HelpRollingModalProps) => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pagenation, setPagenation] = useState(new Array(pageData.length).fill(false));
  const startPos = useRef<number>(0);
  const canDrag = useRef<boolean>(true);
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!playerRef.current) return;

      playerRef.current.stop();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current) return;
    if (isModalOpened) playerRef.current.play();
    else playerRef.current.stop();
  }, [isModalOpened, pageIndex]);

  useEffect(() => {
    const newPageState = new Array(pageData.length).fill(false);
    newPageState[pageIndex] = true;
    setPagenation(newPageState);
  }, [pageIndex]);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const clientX = e.touches[0].clientX;
    startPos.current = clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!canDrag.current) return;

    const clientX = e.touches[0].clientX;
    if (Math.abs(startPos.current - clientX) < 100) return;

    if (clientX - startPos.current > 0) setPageIndex(pageIndex == 0 ? pageData.length - 1 : pageIndex - 1);
    else setPageIndex(pageIndex == pageData.length - 1 ? 0 : pageIndex + 1);

    canDrag.current = false;
    startPos.current = clientX;
  };

  const handleTouchEnd = () => {
    canDrag.current = true;
  };

  return (
    <Modal
      isModalOpened={isModalOpened}
      closeModal={handleCloseModal}
      handleKeyDown={handleKeyDown}
      className="w-full max-w-screen-md"
    >
      <section
        className="flex md:p-7"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="relative -left-6 hidden md:block"
          onClick={() => {
            setPageIndex(pageIndex == 0 ? pageData.length - 1 : pageIndex - 1);
          }}
        >
          <img src={left} width={30} alt="이전 페이지 버튼" className="transition hover:brightness-75" />
        </button>
        <div className="w-full">
          <section className={cn('w-full')}>
            <HelpPage pageData={pageData[pageIndex]} playerRef={playerRef} />
          </section>
          <div className="relative top-5 flex flex-row items-center justify-center p-5">
            {pagenation.map((isSelect, i) => {
              return (
                <button
                  key={i}
                  className={cn(
                    'mx-1.5 box-content h-2.5 w-2.5 rounded-full md:h-3 md:w-3',
                    isSelect ? 'border-4 border-halfbaked-300 bg-chartreuseyellow-300' : 'bg-eastbay-600',
                  )}
                  onClick={() => {
                    setPageIndex(i);
                  }}
                />
              );
            })}
          </div>
        </div>
        <button
          className="relative -right-6 hidden md:block"
          onClick={() => {
            setPageIndex(pageIndex == pageData.length - 1 ? 0 : pageIndex + 1);
          }}
        >
          <img src={right} width={30} alt="다음 페이지 버튼" className="transition hover:brightness-75" />
        </button>
      </section>
    </Modal>
  );
};

export default HelpRollingModal;
