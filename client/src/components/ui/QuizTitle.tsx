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
          'relative flex w-full items-center justify-center border-violet-950 bg-violet-500 p-1.5 text-stroke-sm sm:rounded-lg sm:border-2 sm:p-3.5',
          className,
        )}
        {...props}
      >
        {/* 라운드 정보 */}
        <p className="absolute left-4 text-xs sm:left-3.5 sm:text-xl">
          <span>{currentRound}</span>
          <span> of </span>
          <span>{totalRound}</span>
        </p>

        {/* 제시어 */}
        <h2 className="text-2xl sm:text-4xl">{title}</h2>

        {/* 타이머 */}
        <div className="absolute -right-0 -top-4 w-[4.25rem] sm:-right-10 sm:-top-11 sm:w-[8.75rem]">
          <div className="relative">
            {remainingTime > 10 ? (
              <img src={Timer} alt="타이머" className="h-full w-full" />
            ) : (
              <img src={flashingTimer} alt="타이머" className="h-full w-full" />
            )}

            <span className="absolute inset-0 top-1/2 ml-[0.1rem] flex -translate-y-1/3 items-center justify-center text-base text-stroke-md sm:ml-1 sm:text-[2rem]">
              {remainingTime}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export { QuizTitle };
