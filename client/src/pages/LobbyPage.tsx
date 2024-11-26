import { InviteButton } from '@/components/lobby/InviteButton';
import { StartButton } from '@/components/lobby/StartButton';
import { Setting } from '@/components/setting/Setting';

const LobbyPage = () => {
  return (
    <>
      {/* 중앙 영역 - 대기 화면 */}
      <div className="flex w-full flex-col gap-0 sm:max-w-[39.5rem] sm:gap-4">
        <p className="mb-3 text-center text-xl text-eastbay-50 text-stroke-md sm:mb-0 sm:text-2xl lg:text-3xl">
          Get Ready for the next battle
        </p>

        <Setting />
        <div className="flex h-11 w-full gap-0 sm:h-14 sm:gap-8">
          <StartButton />

          <InviteButton />
        </div>
      </div>
    </>
  );
};
export default LobbyPage;
