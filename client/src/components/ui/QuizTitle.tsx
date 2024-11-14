import { HTMLAttributes } from 'react';
import flashingTimer from '@/assets/small-timer.gif';
import Timer from '@/assets/small-timer.png';
import { cn } from '@/utils/cn';

export interface QuizTitleProps extends HTMLAttributes<HTMLDivElement> {
  currentRound: number;
  totalRound: number;
  title: string;
  remainingTime: number;
}

const QuizTitle = ({ className, currentRound, totalRound, remainingTime, title, ...props }: QuizTitleProps) => {
  return (
    <>
      <div
        className={cn(
          'relative flex w-full max-w-screen-sm items-center justify-center border-violet-950 bg-violet-500 p-1.5 sm:rounded-lg sm:border-2 sm:p-2.5',
          className,
        )}
        {...props}
      >
        {/* 라운드 정보 */}
        <p className="absolute left-2 text-xs text-stroke-sm sm:text-sm md:text-base lg:left-3.5 xl:text-lg">
          <span>{currentRound}</span>
          <span> of </span>
          <span>{totalRound}</span>
        </p>

        {/* 제시어 */}
        <h2 className="text-xl text-stroke-md lg:text-2xl xl:text-3xl">{title}</h2>

        {/* 타이머 */}
        <div className="absolute -right-0 -top-[1.125rem] h-16 w-16 sm:-top-[1.3rem] sm:right-0 sm:h-20 sm:w-20 lg:-right-7 lg:-top-5 lg:w-20 xl:-right-[1.85rem] xl:-top-7 xl:w-24 2xl:-right-8 2xl:-top-9 2xl:w-28">
          <div className="relative">
            {remainingTime > 10 ? (
              <img src={Timer} alt="타이머" className="object-fill" width={128} height={128} />
            ) : (
              <img src={flashingTimer} alt="타이머" className="object-fill" width={128} height={128} />
            )}

            <span className="absolute inset-0 top-1/2 flex -translate-y-1/3 items-center justify-center text-base text-stroke-md sm:text-xl lg:ml-1 lg:text-2xl xl:text-3xl 2xl:text-[2rem]">
              {remainingTime}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export { QuizTitle };
